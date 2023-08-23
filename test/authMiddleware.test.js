const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app'); 
const chai = require('chai');
const { expect } = chai;
const env = require("dotenv");
env.config();
const DBUtils = require('../utils/dbUtils.js');

describe('Authentication Middleware', () => {


    const dbUtils = new DBUtils();
    const username = "test@user.com";
    const password = "Password123";
    const passwordHash = "$2a$10$d8zx.oH7RXrDD9evAXYRaeZ1W/S0jHOjr1x8eoMG57B3S8kHr8wwi";
    const newUsername = "new@user.com";

    before(async () => {
      await dbUtils.run(
        'INSERT INTO users (username, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id',
        [username, passwordHash]
      );
    });
  
    after(async () => {
      await dbUtils.run('DELETE FROM users WHERE username = $1', [username]);
    });
  



    it('should skip authentication for login route', async () => {
        // Add more tests for other paths that should be skipped
        const res = await request(app)
        .post('/api/login')
        .send({ username, password });
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Login successful');
        expect(res.body.token).to.be.a('string'); 
    });


    it('should return 401 if token is missing', async () => {
        const response = await request(app)
        .get('/api/chat');
    
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Token missing');
    });


    it('should return 401 if token is invalid', async () => {
        const invalidToken = 'invalid-token';
        const response = await request(app)
        .get('/api/some-protected-route')
        .set('Authorization', invalidToken)
        .expect(401);

        expect(response.body.message).to.equal('Token invalid or expired');

    });

    it('should set userId on request object if token is valid', async () => {
        const userId = 0;
        const token = jwt.sign({ userId }, process.env.JWT_SECRET);
        const response = await request(app)
        .get('/api/chat')
        .set('Authorization', token)
        .expect(200); 

    });

    it('should return 401 if token is expired', async () => {
        const expiredToken = jwt.sign({ userId: 'expired-user-id' }, process.env.JWT_SECRET, { expiresIn: '0s' });
        const response = await request(app)
        .get('/api/some-protected-route')
        .set('Authorization', expiredToken)
        .expect(401);

        expect(response.body.message).to.equal('Token invalid or expired');
    });
});
