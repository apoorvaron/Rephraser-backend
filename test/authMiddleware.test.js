const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const authenticateToken = require('../Middlewares/authMiddleware');

describe('Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { path: '', header: sinon.stub() };
    res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should skip authentication for specific paths', () => {
    req.path = '/api/login';

    authenticateToken(req, res, next);

    expect(next.calledOnce).to.be.true;
  });

  it('should return 401 if token is missing', () => {
    req.path = '/api/chat';
    req.header.returns(undefined);

    authenticateToken(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: 'Token missing' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should return 401 if token is invalid', () => {
    req.path = '/api/some-protected-route';
    req.header.returns('invalid-token');

    authenticateToken(req, res, next);

    expect(next.notCalled).to.be.true;
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: 'Token invalid or expired' })).to.be.true;
  });

  it('should call next if token is valid', () => {
    req.path = '/api/some-protected-route';
    req.user_id = 93;
    req.header.returns('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjkzLCJpYXQiOjE2OTI3OTI5MjEsImV4cCI6MTY5Mjg3OTMyMX0._gNzF-LJRsOAZ_LDplTxaigsFC3WbTxv6vXeNVyd2iA');
    sinon.stub(jwt, 'verify').returns({ userId: req.user_id });

    authenticateToken(req, res, next);
    expect(req.userId).to.equal(req.user_id);
    expect(res.status.notCalled).to.be.true;
    expect(res.json.notCalled).to.be.true;

  });

});
