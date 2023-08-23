const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const authenticateToken = require('../Middlewares/authMiddleware');

describe('Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { path: '', header: sinon.stub() };
    res = { status: sinon.stub(), json: sinon.spy() };
    next = sinon.spy();
  });

  it('should skip authentication for specific paths', () => {
    req.path = '/api/login';

    authenticateToken(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(res.status.notCalled).to.be.true;
    expect(res.json.notCalled).to.be.true;
  });

  it('should return 401 if token is missing', () => {
    req.path = '/api/chat';
    req.header.returns(undefined);
    res.status.returns(res);

    authenticateToken(req, res, next);

    expect(next.notCalled).to.be.true;
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: 'Token missing' })).to.be.true;
  });

  it('should return 401 if token is invalid', () => {
    req.path = '/api/some-protected-route';
    req.header.returns('invalid-token');
    res.status.returns(res);

    authenticateToken(req, res, next);

    expect(next.notCalled).to.be.true;
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: 'Token invalid or expired' })).to.be.true;
  });

});
