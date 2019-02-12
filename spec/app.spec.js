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

        it('Returns all articles with comment count and other keys if no query is provided', () => {
            return request
                .get('/api/articles?author=butter_bridge&order=asc')
                .expect(200)
                .then((res) => {
                    const articles = res.body;
                    expect(articles).to.be.an('array');
                    expect(articles[0]).to.be.an('object');  
                    expect(articles[0]).to.contain.keys('article_id', 'title', 'topic', 'votes', 'author', 'created_at', 'comment_count');  
            })
        });
         it('Returns articles for given author', () => {
            return request
            .get('/api/articles?author=butter_bridge')
            .expect(200)
            .then((res) => {
                const articles = res.body;
                expect(articles).to.be.an('array');
                expect(articles[0]).to.be.an('object');  
                expect(articles[0]).to.contain.keys('article_id', 'title', 'topic', 'votes', 'author', 'created_at', 'comment_count');  
                expect(articles[0].author).to.equal('butter_bridge');
            });
        });
        it('Returns no articles for non-existent topic', () => {
            return request
            .get('/api/articles?topic=wiii')
            .expect(200)
            .then((res) => {
                const articles = res.body;
                expect(articles.length).to.equal(0);
            });
        });

        it('Returns articles sorted as request', () => {
            return request
            .get('/api/articles?sort-by=article_id&order=desc')
            .expect(200)
            .then((res) => {
                const articles = res.body;
                expect(articles).to.be.an('array');
                expect(articles[0].article_id).to.be.lessThan(articles[1].article_id)
            });
        });
        
    });
    
    describe('POST /api/articles', () => {
        it('Returns posted article when posting an article', () => {
            const article = {
                title: 'Something funny',
                body: 'Hey there. I am supposed to be funny.',
                topic: 'mitch',                
                username: 'butter_bridge'};
            return request
                .post('/api/articles')
                .send(article)
                .expect(201)    
                .then((res) => {
                    const article = res.body;
                    
                    expect(article[0]).to.contain.keys('article_id', 'title', 'topic', 'votes', 'author', 'created_at', 'topic');                      
                    expect(article[0].author).to.equal('butter_bridge')
                    expect(article[0].title).to.equal('Something funny')
                });
        });

        it('Returns error when posting article with non existing user', () => {
            const article = {
                title: 'Something funny',
                body: 'Hey there. I am supposed to be funny.',
                topic: 'mitch',                
                username: 'shumi'};
            return request
                .post('/api/articles')
                .send(article)
                .expect(404);
        });

    });
    
    describe('GET /api/articles/:article_id', () => {
        it('Returns the article object with appropriate keys for an existing article', () => {
            return request
                .get('/api/articles/1')
                .expect(200)
                .then((res) => {
                    const article = res.body;
                    expect(article[0]).to.contain.keys('article_id', 'title', 'topic', 'votes', 'author', 'created_at', 'comment_count');                      
                    expect(article[0].article_id).to.equal(1)
                })
        });

         it('Returns error for non-existent article', () => {
            return request
                .get('/api/articles/7368734378')
                .expect(404);
        }); 
    });
    
    describe('PATCH /api/articles/:article_id', () => {
        const increaseVote = { inc_votes : 1 };
        const decreaseVote = { inc_votes : -5 };
    
        it('Returns 202 with the updated article object with new increased  votes', () => {        
            const newVote = 101;
            return request
                .patch('/api/articles/1')
                .send(increaseVote)
                .expect(202)
                .then((res) => {                    
                    const updatedArticle = res.body[0];
                    expect(updatedArticle['article_id']).to.equal(1);
                    expect(updatedArticle['votes']).to.equal(newVote);
                });
        });

        it('Returns 202 with the updated article object with new decreased  votes', () => {
            const newVote = 95;
            return request
                .patch('/api/articles/1')
                .send(decreaseVote)
                .expect(202)
                .then((res) => {                             
                    const updatedArticle = res.body[0];
                    expect(updatedArticle['article_id']).to.equal(1);
                    expect(updatedArticle['votes']).to.equal(newVote);
                });
        });

            it('Returns 404 when updating a non-existent article', () => {              
                return request
                    .patch('/api/articles/1232323')
                    .send(decreaseVote)
                    .expect(404);
            });
    });
    
    //TODO do a check to see if article_id is still there?
    describe('DELETE /api/articles/:article_id', () => {
        it('Returns 204 after it deletes an article', () => {
            return request
                .delete('/api/articles/1')
                .expect(204);
        });
    });


    describe('PATCH /api/comments/:comment_id', () => { 
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

            it('Returns 404 when updating a non-existent comment', () => {              
                return request
                    .patch('/api/comments/1232323')
                    .send(decreaseVote)
                    .expect(404);
            });
    });


    //TODO do a check to see if comment_id is still there?
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

