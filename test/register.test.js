const chai = require('chai');
const { expect } = chai;

const supertest = require('supertest');
const app = require('../app.js');
const DBUtils = require('../utils/dbUtils.js');

describe('Registration API', () => {
  const dbUtils = new DBUtils();
  const existingUsername = "test@user.com";
  const newUsername = "new@user.com";

  before(async () => {
    await dbUtils.run(
      'INSERT INTO users (username, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id',
      [existingUsername, "tempPassword123"]
    );
  });

  after(async () => {
    await dbUtils.run('DELETE FROM users WHERE username in ($1, $2)', [existingUsername, newUsername]);
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
      username: existingUsername,
      password: 'Test1234',
    };

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
      username: newUsername,
      password: 'Strong1234',
    };

    const res = await supertest(app)
      .post('/api/register')
      .send(newUser);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Registration Successful');
    expect(res.body.token).to.be.a('string');
    expect(res.body.username).to.be.a('string');
  });
});
