const test = require('supertest');
const app = require('../../express.js');

// Test login with valid credentials
describe('Login with valid credentials', () => {
  it('should return a token', (done) => {
    test(app)
      .post('/auth/login')
      .send({
        username: 'test',
        password: 'fkiYfyTPFFtPjR5',
      })
      .expect(200, done);
  });
});
// Test Login with non matching password
describe('Login with non matching password', () => {
  it('should return 401', (done) => {
    test(app)
      .post('/auth/login')
      .send({
        username: 'test',
        password: 'wrongpassword',
      })
      .expect('Content-Type', /json/)
      .expect(401, done);
  });
});

// Test login with non existing credentials
describe('Login with non-existing credentials', () => {
  it('should return 401', (done) => {
    test(app)
      .post('/auth/login')
      .send({
        username: 'test123',
        password: 'wrongpassword123',
      })
      .expect('Content-Type', /json/)
      .expect(403, done);
  });
});

// Test register route if returns a response
describe('Register route', () => {
  it('should return a response', (done) => {
    test(app).post('/auth/register').expect(500, done);
  });
});

// Test check auth route if returns a response
describe('Check auth route', () => {
  it('should return a response', (done) => {
    test(app).get('/auth/check_login').expect(500, done);
  });
});
