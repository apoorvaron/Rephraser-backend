const chai = require('chai');
const { expect } = chai;

const supertest = require('supertest');
const app = require('../app.js'); // Update the path accordingly
const db = require('../config/db.js'); // Update the path accordingly

describe('Registration API', () => {


  it('should handle missing credentials', async () => {
    const res = await supertest(app)
      .post('/api/register')
      .send({});
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Missing Credentials');
  });

  it('should handle already registered usernames', async () => {
    const existingUser = {
      username: 'test',
      password: 'Test1234',
    };
    await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [existingUser.username, existingUser.password]);

    const res = await supertest(app)
      .post('/api/register')
      .send(existingUser);
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Username already registered');
  });

  it('should handle weak passwords', async () => {
    const weakPasswordUser = {
      username: 'weakuser',
      password: 'weak', // Weak password
    };

    const res = await supertest(app)
      .post('/api/register')
      .send(weakPasswordUser);
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Password is not strong enough');
  });

  it('should handle successful registration', async () => {

    const existingUser = {
      username: 'test',
      password: 'Test1234',
    };
  
    // Check if the user exists and delete it if it does
    const userQueryResult = await db.query('SELECT id FROM users WHERE username = $1', [existingUser.username]);
    if (userQueryResult.rows.length > 0) {
      await db.query('DELETE FROM users WHERE username = $1', [existingUser.username]);
    }
  
    const res = await supertest(app)
      .post('/api/register')
      .send(existingUser);
    
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Registration Successful');
  
    // You can also add additional assertions or checks here if needed
  });
  

});
