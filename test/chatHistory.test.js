const chai = require('chai');
const { expect } = chai;
const env = require("dotenv");
env.config();
const supertest = require('supertest');
const app = require('../app.js');
const DBUtils = require('../utils/dbUtils.js');
const { generateToken } = require('../utils/jwtUtils');

describe('Chat History API', async () => {
  const dbUtils = new DBUtils();
  let userId;

  before(async () => {
    // Insert user into the database and get the generated user_id
    const userResponse = await dbUtils.run(
      'INSERT INTO users (email, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id',['testuser', 'testpassword']
    );
    userId = userResponse.rows[0].id; 

    // Insert chat history entries into the database for the user
    await dbUtils.run(
      'INSERT INTO corrections (user_id, original_text, rephrased_text, created_at) VALUES ($1, $2, $3, $4)',
      [userId, 'Hello', 'Hi there', new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
    await dbUtils.run(
      'INSERT INTO corrections (user_id, original_text, rephrased_text, created_at) VALUES ($1, $2, $3, $4)',
      [userId, 'Original_text', 'Rephrased_text', new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );

  });

  after(async () => {
    // Delete the inserted chat history entries
    await dbUtils.run('DELETE FROM corrections WHERE user_id = $1', [userId]);

    // Delete the inserted user
    await dbUtils.run('DELETE FROM users WHERE id = $1', [userId]);
  });

  it('should return chat history of the user', async () => {
    const res = await supertest(app)
      .get('/api/chat')
      .set('Authorization', generateToken(userId)) 
      .expect(200);
  
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('Transactions'); 
    expect(res.body).to.have.property('History'); 
    
    // Check the Transactions property
    expect(res.body.Transactions).to.be.a('string');

    // Check the History property
    expect(res.body.History).to.be.an('array');
    expect(res.body.History.length).to.be.greaterThan(0);

    // Check if only chats for the specific user are displayed
    for (const message of res.body.History) {
      expect(message.sender).to.be.oneOf(['user', 'bot']);
      expect(message).to.have.property('text');
      expect(message).to.have.property('time');
    }
  });
});