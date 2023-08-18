const chai = require('chai');
const { expect } = chai;

const supertest = require('supertest');
const app = require('../app.js');

describe('Login API', () => {
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
      .send({ username: 'nonexistent', password: 'invalidpassword' });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('User does not exist');
  });

  it('should handle incorrect passwords', async () => {
    const res = await supertest(app)
      .post('/api/login')
      .send({ username: 'test', password: 'wrongpassword' });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Wrong Password');
  });

  it('should handle successful login', async () => {
    const res = await supertest(app)
      .post('/api/login')
      .send({ username: 'test', password: 'Test1234' });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Login successful');
    expect(res.body.token).to.be.a('string'); // Check if a token is returned and it's a string
  });
});

