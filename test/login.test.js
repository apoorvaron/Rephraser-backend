const chai = require('chai');
const { expect } = chai;

const supertest = require('supertest');
const app = require('../app.js');
const DBUtils = require('../utils/dbUtils.js');

describe('Login API', async () => {
  const dbUtils = new DBUtils();
  const email = "test@user.com";
  const password = "Password123";
  const passwordHash = "$2a$10$d8zx.oH7RXrDD9evAXYRaeZ1W/S0jHOjr1x8eoMG57B3S8kHr8wwi";

  before(async () => {
    await dbUtils.run(
      'INSERT INTO users (email, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id',
      [email, passwordHash]
    );
  });

  after(async () => {
    await dbUtils.run('DELETE FROM users WHERE email = $1', [email]);
  });

  it('should handle missing credentials', async () => {
    const res = await supertest(app)
      .post('/api/login')
      .send({});
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Missing Credentials');
  });

  it('should handle non-existing users', async () => {
    const res = await supertest(app)
      .post('/api/login')
      .send({ email: 'nonexistent', password: 'invalidpassword' });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('User does not exist');
  });

  it('should handle incorrect passwords', async () => {
    const res = await supertest(app)
      .post('/api/login')
      .send({ email, password: 'wrongpassword' });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Wrong Password');
  });

  it('should handle successful login', async () => {
    const res = await supertest(app)
      .post('/api/login')
      .send({ email, password });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Login successful');
    expect(res.body.token).to.be.a('string'); // Check if a token is returned and it's a string
    expect(res.body.username).to.be.a('string');
  });
});
