const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const { sendChat } = require('../controllers/chat.js');
const OpenAI = require("openai"); // Import OpenAI correctly
const DBUtils = require('../utils/dbUtils.js');
const env = require("dotenv");
env.config();

describe('sendChat API', () => {
    let req, res, next, createStub, dbUtilsRunStub;

    beforeEach(() => {
        req = {
        body: { text: 'Is you at home?' },
        userId: Math.floor(Math.random() * 100) + 1,
        };
        res = { sendStatus: sinon.spy() };

        // Stub the DBUtils.prototype.run method
        dbUtilsRunStub = sinon.stub(DBUtils.prototype, 'run');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should send rephrased text to the OpenAI API and store the result in the database', async () => {
        // Create a mock instance of OpenAI (no need for actual API key)
        const openai = new OpenAI({ apiKey: 'fake-api-key' });

        // Stub the openai.chat.completions.create method
        createStub = sinon.stub(openai.chat.completions, 'create');

        // Set up the expected response from OpenAI API
        const mockResponse = {
        choices: [
            {
                message: {
                    content: 'Rephrased text without quotes.',
                },
            },
        ],
        };

        // Configure the stub to resolve with the mockResponse
        createStub(mockResponse);

        // Call the sendChat function
        await sendChat(req, res);

        // Assert that the OpenAI API was called once
        expect(createStub.calledOnce).to.be.true;

        // Assert that the DBUtils.prototype.run method was called once
        expect(dbUtilsRunStub.calledOnce).to.be.true;
    });
});
