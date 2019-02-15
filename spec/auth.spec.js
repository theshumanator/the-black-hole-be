const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const db = require('../db.js');

const request = supertest(app);

describe('/api', () => {
  /*  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy()); */


  after(() => db.$pool.end());
  describe('/api/login', () => {
    it('POST responds with an access token given correct username and password', () => request
      .post('/api/login')
      .send({ username: 'tommy', password: 'T0m1sCool' })
      .expect(200)
      .then(({ body }) => {
        expect(body).to.have.ownProperty('token');
      }));
    it('POST responds with status 401 for an incorrect password', () => request
      .post('/api/login')
      .send({ username: 'mitch', password: 'wrongpassword' })
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal('invalid username or password');
      }));
    it('POST responds with status 401 for an incorrect username', () => request
      .post('/api/login')
      .send({ username: 'paul', password: 'secure123' })
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal('invalid username or password');
      }));
  });
});
