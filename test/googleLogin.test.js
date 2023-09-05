const { expect } = require('chai');
const sinon = require('sinon');
const { googleLogin } = require('../controllers/googleLogin');
const DBUtils = require('../utils/dbUtils');
const { OAuth2Client } = require('google-auth-library');

describe('Google Login API', () => {
  let req, res, verifyIdTokenStub;
  const dbUtils = new DBUtils();
  const existingEmail = "test@user.com";
  const newEmail = "new@user.com";
  const password = "Password123";
  const passwordHash = "$2a$10$d8zx.oH7RXrDD9evAXYRaeZ1W/S0jHOjr1x8eoMG57B3S8kHr8wwi";

  beforeEach(async() => {
    // Create request and response objects
    req = {
      body: {
        id_token: 'mocked_id_token', 
      },
    };

    res = {
      status: sinon.stub().returnsThis(), 
      json: sinon.stub(),
    };

    // Stub the OAuth2Client verifyIdToken method
    verifyIdTokenStub = sinon.stub(OAuth2Client.prototype, 'verifyIdToken');

    // Insert a mock user into the test database
    const insertQuery = 'INSERT INTO users (email, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id';
    const insertValues = [existingEmail, passwordHash];
    await dbUtils.run(insertQuery, insertValues);
  });

  afterEach(async() => {
    await dbUtils.run('DELETE FROM users WHERE email = $1', [existingEmail]);
    await dbUtils.run('DELETE FROM users WHERE email = $1', [newEmail]);
    sinon.restore();
  });

  it('should handle new user', async () => {
    // Configure the stub
    verifyIdTokenStub.returns({
      getPayload: () => ({ email: newEmail }),
    });

    // Call the googleLogin function
    await googleLogin(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Login successful' })).to.be.true;
  });

  it('should handle existing user', async () => {
    // Configure the stub
    verifyIdTokenStub.returns({
      getPayload: () => ({ email: existingEmail }),
    });

    // Call the googleLogin function
    await googleLogin(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Login successful' })).to.be.true;
  });
});
