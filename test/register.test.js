const chai = require('chai');
const { expect } = chai;

const supertest = require('supertest');
const app = require('../app.js'); 
const DBUtils = require('../utils/dbUtils.js'); 

describe('Registration API', () => {
  let dbUtils;

  // Before all tests, create an instance of DBUtils
  before(() => {
    dbUtils = new DBUtils();
  });

  // After all tests, disconnect the DBUtils
  after(async () => {
    await dbUtils.disconnect();
  });

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

    const queryInsertUser = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    const valuesInsertUser = [existingUser.username, existingUser.password];

    await dbUtils.run(queryInsertUser, valuesInsertUser);

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
    const newUser = {
      username: 'newuser',
      password: 'Strong1234',
    };

    // Check if the user exists and delete it if it does
    const queryCheckUser = 'SELECT id FROM users WHERE username = $1';
    const valuesCheckUser = [newUser.username];
    const userQueryResult = await dbUtils.run(queryCheckUser, valuesCheckUser);
    
    if (userQueryResult.rows.length > 0) {
      const deleteQuery = 'DELETE FROM users WHERE username = $1';
      await dbUtils.run(deleteQuery, [newUser.username]);
    }

    const res = await supertest(app)
      .post('/api/register')
      .send(newUser);
    
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Registration Successful');

  });
});
