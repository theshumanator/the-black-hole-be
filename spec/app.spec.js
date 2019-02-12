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

        /* it('Returns status 200 with an array of user objects with appropriate keys', () => {
            return request
                .get('/api/comments')
                .expect(200)
                .then((res) => {
                    const users = res.body; 
                    console.log(users[0]);  
                })
        }); */


        const increaseVote = { inc_votes : 1 };
        const decreaseVote = { inc_votes : -5 };

        const comment = { comment_id: 1,
            author: 'butter_bridge',
            article_id: 9,
            votes: 16,
            created_at: '2017-11-22T12:36:03.389Z',
            body:
             "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!" };
             

             it('Returns 201 with the updated comment object with new increased  votes', () => {                
                const newVote = 17;
                return request
                    .patch('/api/comments/1')
                    .send(increaseVote)
                    .expect(202)
                    .then((res) => {                    
                        const updatedComment = res.body[0];
                        expect(updatedComment['comment_id']).to.equal(comment['comment_id']);
                        expect(updatedComment['votes']).to.equal(newVote);
                    });
            });

           

            it('Returns 201 with the updated comment object with new decreased votes', () => {
                const newVote = 11;
                return request
                    .patch('/api/comments/1')
                    .send(decreaseVote)
                    .expect(202)
                    .then((res) => {                             
                        const updatedComment = res.body[0];
                        expect(updatedComment['comment_id']).to.equal(comment['comment_id']);
                        expect(updatedComment['votes']).to.equal(newVote);
                    });
            });

            it('Returns 404 when updating a non-existent comment', () => {              return request
                    .patch('/api/comments/1232323')
                    .send(decreaseVote)
                    .expect(404);
            });
    });
    
    describe('DELETE /api/comments/:comment_id', () => {
        it('Returns 204 after it deletes a comment', () => {
            return request
                .delete('/api/comments/1')
                .expect(204);
        });
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
        });
    });      
});

