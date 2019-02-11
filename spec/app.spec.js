process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);

describe('GET /api', () => {
  it('Responds with informative string of possible APIs stored in a key called msg', () => request
    .get('/api')
    .expect(200)
    .then((res) => {
      expect(res.body.msg).to.have.string('The following API endpoints are possible:      GET => /api/topics');
    }));
});

describe('GET /api/topics', () => {

});

describe('POST /api/topics', () => {

});

describe('GET /api/articles', () => {

});

describe('POST /api/articles', () => {

});

describe('GET /api/articles/:article_id', () => {

});

describe('PATCH /api/articles/:article_id', () => {

});

describe('DELETE /api/articles/:article_id', () => {

});

describe('PATCH /api/comments/:comment_id', () => {

});

describe('DELETE /api/comments/:comment_id', () => {

});

describe('GET /api/users', () => {

});

describe('POST /api/users', () => {

});

describe('GET /api/users/:username', () => {

});
