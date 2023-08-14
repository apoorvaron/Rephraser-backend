import chai from 'chai';
const { expect } = chai;

import supertest from 'supertest';
import  app from '../app.js'; // Assumes your app is in the app.js file

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
      .send({ username: 'apoorvaron', password: 'wrongpassword' });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Wrong Password');
  });

  it('should handle successful login', async () => {
    const res = await supertest(app)
      .post('/api/login')
      .send({ username: 'apoorvaron', password: 'apoorvaron' });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Login successful');
  });
});
