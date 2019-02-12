process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);


describe('End point tests', () => {
    
    beforeEach(() => connection.seed.run());

    after(() => connection.destroy());

    describe('GET /api', () => {
        it('Responds with informative string of possible APIs stored in a key called msg', () => {
        return request
            .get('/api')
            .expect(200)
            .then((res) => {
            expect(res.body.msg).to.have.string('The following API endpoints are possible:      GET => /api/topics');
        });
        });
    });
    describe('GET /api/topics', () => {
        it('Returns status 200 with an array of topic objects with appropriate keys', () => {
            return request
                .get('/api/topics')
                .expect(200)
                .then((res) => {
                    const topics = res.body; 
                    expect(topics).to.be.an('array');
                    expect(topics[0]).to.be.an('object');  
                    expect(topics[0]).to.contain.keys('slug', 'description');  
                })
        });
    });
    
    describe('POST /api/topics', () => {
        it('Returns status 201 with the new topic posted', () => {
            const newTopic = {'slug': 'slug-master', 'description': 'I am the slug master'};
        return request
                .post('/api/topics')
                .send(newTopic)
                .expect(201)
                .then((res) => {
                    const topic = res.body;
                    expect(topic).to.have.length(1);
                    expect(topic[0]).to.deep.equal(newTopic);
                })
        });
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
        it('Returns status 200 with an array of user objects with appropriate keys', () => {
            return request
                .get('/api/users')
                .expect(200)
                .then((res) => {
                    const users = res.body; 
                    expect(users).to.be.an('array');
                    expect(users[0]).to.be.an('object');  
                    expect(users[0]).to.contain.keys('username', 'avatar_url', 'name');  
                })
        });
    });
    
    describe('POST /api/users', () => {
        it('Returns status 201 with the new user created', () => {
            const newUser = {'username': 'shumanator', 'avatar_url': 'https://wwww.someurl.com', 'name': 'shumi'};
        return request
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .then((res) => {
                    const user = res.body;
                    expect(user).to.have.length(1);
                    expect(user[0]).to.deep.equal(newUser);
                })
        });
    });

    describe('GET /api/users/:username', () => {
        it('Returns status 200 with the user object for given username', () => {
            const expectedUser = {'username': 'butter_bridge', 'avatar_url': 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg', 'name': 'jonny'};
        return request
                .get('/api/users/butter_bridge')
                .expect(200)
                .then((res) => {
                    const user = res.body;
                    expect(user).to.have.length(1);
                    expect(user[0]).to.deep.equal(expectedUser);
                })
        });

        it('Returns status 404 and null if user is not found', () => {   return request
                .get('/api/users/butter_bridg3e')
                .expect(404) 
                .then((res) => {
                    expect(res.body).to.be.null;
                })               
        });
    });      
});

