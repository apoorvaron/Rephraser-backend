const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../app');
const DBUtils = require('../utils/dbUtils.js');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
const sinon = require('sinon');
const openaiUtils = require('../utils/openaiUtils.js');
env.config();

describe('sendChat API', () => {
    const dbUtils = new DBUtils();
    const email = "test@user.com";
    const password = "Password123";
    const passwordHash = "$2a$10$d8zx.oH7RXrDD9evAXYRaeZ1W/S0jHOjr1x8eoMG57B3S8kHr8wwi";
    let agent;
    let userId;

    before(async () => {
        agent = supertest.agent(app);
    });

    afterEach(async () => {
        if (userId) {
            await dbUtils.run('DELETE FROM users WHERE id=' + userId);
        }
    });

    it('should send rephrased text to the OpenAI API and store the result in the database', async () => {
        // Insert a user into the users table
        const userInsertValues = [email, passwordHash];
        const userInsertQuery = `
            INSERT INTO users (email, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id
        `;
        const userInsertResult = await dbUtils.run(userInsertQuery, userInsertValues);
        userId = userInsertResult.rows[0].id;

        // Get the number of rows before the test
        const queryResultBefore = await dbUtils.run('SELECT COUNT(*) FROM corrections');
        const numRowsBefore = parseInt(queryResultBefore.rows[0].count);

        // Stub the getRephrasedText function to return a mock response
        const getRephrasedTextStub = sinon.stub(openaiUtils, 'getRephrasedText').returns('Rephrased text without quotes.');

        // Stub jwt.verify to return a specific object with the user_id we inserted
        sinon.stub(jwt, 'verify').returns({ userId: userId });

        const token = 'your-mock-token';
        const response = await agent
            .post('/api/chat')
            .set('Authorization', token)
            .send({ text: 'Is you at home?' });

        // Assert that the API responded with a status of 200
        expect(response.status).to.equal(200);
        expect(response.body.Transactions).to.be.a('string');
        expect(getRephrasedTextStub.calledOnce).to.be.true;

        // Assert that the database was interacted with as expected
        const queryResultAfter = await dbUtils.run('SELECT COUNT(*) FROM corrections');
        const numRowsAfter = parseInt(queryResultAfter.rows[0].count);

        // Check that only one additional entry is made
        expect(numRowsAfter).to.equal(numRowsBefore + 1);

        // Restore stubs
        getRephrasedTextStub.restore();
    });
});
