const test = require('supertest');
const app = require('../../express.js');

// Test Twitter API with bearer token
describe('GET /twitter/get_recent_tweets', () => {
  // Test Twitter API with bearer token
  it('should return 200', (done) => {
    test(app).get('/twitter/get_recent_tweets').send({ token: process.env.TWITTER_TOKEN, query: 'test' }).expect('Content-Type', /json/).expect(200, done);
  });
});
