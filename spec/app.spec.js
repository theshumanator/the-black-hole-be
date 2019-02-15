process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');
const defaults = require('superagent-defaults');
const app = require('../app');
const connection = require('../db/connection');

const request = defaults(supertest(app));

describe('End point tests', () => {
  beforeEach(() => connection.seed.run()
    .then(() => request
      .post('/api/login')
      .expect(200)
      .send({ username: 'jimmy', password: 'J1immyz2' }))
    .then(({ body: { token } }) => {
      request.set('Authorization', `BEARER ${token}`);
    })
    .catch((error) => {
    }));

  after(() => {
    connection.destroy();
  });

  describe('GET /something', () => {
    it('Returns 404 unhandled route for a non-exstent endpoint', () => request
      .get('/something')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).to.equal('Unhandled route error! something');
      }));
  });

  describe('/api', () => {
    describe('GET /api', () => {
      it('Responds with informative string of possible APIs stored in a key called msg', () => request
        .get('/api')
        .expect(200)
        .then((res) => {
          expect(res.body).to.contain.keys('Topics: /api/topics', 'Articles: /api/articles', 'Article: /api/articles/:article_id', 'Comments of article: /api/articles/:article_id/comments', 'Comments: /api/comments/:comment_id', 'Users: /api/users', 'User: /api/users/:username', 'API: /api');
        }));
    });
    describe('POST /api', () => {
      it('Returns with 405 and unhandled method error', () => request
        .post('/api')
        .expect(405)
        .then((res) => {
          expect(res.body.msg).to.equal('The method is not handled for this route');
        }));
    });
  });

  describe('/api/secrets', () => {
    it('Responds with an array of secrets', () => request
      .get('/api/secrets')
      .expect(200)
      .then(({ body: { secrets } }) => {
        expect(secrets).to.be.an('Array');
        expect(secrets[0]).to.have.all.keys(
          'secret_id',
          'secret_text',
          'user_id',
        );
      }));
    /*  it('GET responds with 401 if no token provided', () => request
      .get('/api/secrets')
      .set('Authorization', '')
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal('Unauthorised');
      })); */
  });

  describe('/api/login', () => {
    it('POST responds with an access token given correct username and password', () => request
      .post('/api/login')
      .send({ username: 'jimmy', password: 'J1immyz2' })
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

  describe('/api/topics', () => {
    describe('GET /api/topics', () => {
      it('Returns status 200 with an array of topic objects with appropriate keys', () => request
        .get('/api/topics')
        .expect(200)
        .then((res) => {
          const { topics } = res.body;
          expect(topics).to.be.an('array');
          expect(topics[0]).to.be.an('object');
          expect(topics[0]).to.contain.keys('slug', 'description');
        }));
    });

    describe('POST /api/topics', () => {
      it('Returns status 201 with the new topic posted', () => {
        const newTopic = { slug: 'slug-master', description: 'I am the slug master' };
        return request
          .post('/api/topics')
          .send(newTopic)
          .expect(201)
          .then((res) => {
            const { topic } = res.body;
            expect(topic).to.deep.equal(newTopic);
          });
      });

      it('Returns status 422 if topic slug already exists', () => {
        const newTopic = { slug: 'mitch', description: 'I am the slug master' };
        return request
          .post('/api/topics')
          .send(newTopic)
          .expect(422)
          .then((res) => {
            expect(res.body.msg).to.equal('Key (slug)=(mitch) already exists.');
          });
      });

      it('Returns status 400 if description is not included in json', () => {
        const newTopic = { slug: 'shumiSlug' };
        return request
          .post('/api/topics')
          .send(newTopic)
          .expect(400)
          .then((res) => {
            expect(res.body.msg).to.equal('Missing data in the json. JSON must include: slug and description');
          });
      });

      it('Returns status 400 if slug is not included in json', () => {
        const newTopic = { description: 'I am the slug master' };
        return request
          .post('/api/topics')
          .send(newTopic)
          .expect(400)
          .then((res) => {
            expect(res.body.msg).to.equal('Missing data in the json. JSON must include: slug and description');
          });
      });
    });

    describe('DELETE /api/topics', () => {
      it('Returns with 405 and unhandled method error', () => request
        .delete('/api/topics')
        .expect(405)
        .then((res) => {
          expect(res.body.msg).to.equal('The method is not handled for this route');
        }));
    });
  });

  describe('/api/articles', () => {
    describe('GET /api/articles', () => {
      it('Returns all articles for a given article_idwith all the reqd keys', () => request
        .get('/api/articles/1')
        .expect(200)
        .then((res) => {
          const { article } = res.body;
          expect(article).to.be.an('object');
          expect(article).to.contain.keys('article_id', 'title', 'topic', 'votes', 'author', 'created_at', 'comment_count', 'body');
          expect(article.article_id).to.equal(1);
          expect(article.author).to.equal('butter_bridge');
        }));

      it('Returns all articles for a given author with all the reqd keys', () => request
        .get('/api/articles?author=butter_bridge')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).to.be.an('array');
          expect(articles[0]).to.be.an('object');
          expect(articles[0]).to.contain.keys('article_id', 'title', 'topic', 'votes', 'author', 'created_at', 'comment_count');
          expect(articles[0].author).to.equal('butter_bridge');
        }));

      it('Returns all articles if topic does not exist', () => request
        .get('/api/articles?topic=wiii')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).to.be.an('array');
          expect(articles[0]).to.be.an('object');
          expect(articles[0]).to.contain.keys('article_id', 'title', 'topic', 'votes', 'author', 'created_at', 'comment_count');
        }));

      it('Returns articles sorted as request', () => request
        .get('/api/articles?sort_by=article_id&order=desc')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).to.be.an('array');
          expect(articles[0].article_id).to.be.greaterThan(articles[1].article_id);
        }));

      it('Returns the first 2 articles for a given author', () => request
        .get('/api/articles?author=butter_bridge&limit=2')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles.length).to.equal(2);
          expect(articles[0]).to.contain.keys('article_id', 'title', 'topic', 'votes', 'author', 'created_at', 'comment_count');
          expect(articles[0].author).to.equal('butter_bridge');
          expect(articles[1].author).to.equal('butter_bridge');
        }));

      it('Returns the last article (given author has 3 articles) for a given author', () => request
        .get('/api/articles?author=butter_bridge&limit=2&p=2')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles.length).to.equal(1);
          expect(articles[0]).to.contain.keys('article_id', 'title', 'topic', 'votes', 'author', 'created_at', 'comment_count');
          expect(articles[0].author).to.equal('butter_bridge');
        }));

      it('Returns the total count for a given author regardless of limit/page', () => request
        .get('/api/articles?author=butter_bridge&limit=2&p=2')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles.length).to.equal(1);
          expect(articles[0]).to.contain.keys('article_id', 'title', 'topic', 'votes', 'author', 'created_at', 'comment_count');
          expect(articles[0].author).to.equal('butter_bridge');
          expect(res.body.total_count).to.equal(3);
        }));
    });

    describe('POST /api/articles', () => {
      it('Returns posted article when posting an article', () => {
        const article = {
          title: 'Something funny',
          body: 'Hey there. I am supposed to be funny.',
          topic: 'mitch',
          username: 'butter_bridge',
        };
        return request
          .post('/api/articles')
          .send(article)
          .expect(201)
          .then((res) => {
            const articleRes = res.body.article;
            expect(articleRes).to.contain.keys('article_id', 'title', 'topic', 'votes', 'author', 'created_at', 'topic');
            expect(articleRes.author).to.equal('butter_bridge');
            expect(articleRes.title).to.equal('Something funny');
          });
      });

      it('Returns 404 error when posting article with missing username', () => {
        const article = {
          title: 'Something funny',
          body: 'Hey there. I am supposed to be funny.',
          topic: 'mitch',
        };
        return request
          .post('/api/articles')
          .send(article)
          .expect(400)
          .then((res) => {
            expect(res.body.msg).to.equal('Missing data in the json. JSON must include: title, body, topic and username');
          });
      });

      it('Ignores the votes if the value is not an integer', () => {
        const article = {
          title: 'Something funny',
          body: 'Hey there. I am supposed to be funny.',
          topic: 'mitch',
          votes: 'abc',
          username: 'butter_bridge',
        };
        return request
          .post('/api/articles')
          .send(article)
          .expect(201)
          .then((res) => {
            expect(res.body.article.votes).to.equal(0);
          });
      });

      it('Returns 404 error when posting article with non existing user', () => {
        const article = {
          title: 'Something funny',
          body: 'Hey there. I am supposed to be funny.',
          topic: 'mitch',
          username: 'shumi',
        };
        return request
          .post('/api/articles')
          .send(article)
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Key (author)=(shumi) is not present in table "users".');
          });
      });

      it('Returns 404 error when posting article with non existing topic', () => {
        const article = {
          title: 'Something funny',
          body: 'Hey there. I am supposed to be funny.',
          topic: 'shumi',
          username: 'butter_bridge',
        };
        return request
          .post('/api/articles')
          .send(article)
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Key (topic)=(shumi) is not present in table "topics".');
          });
      });
    });

    describe('PATCH /api/articles', () => {
      it('Returns with 405 and unhandled method error', () => request
        .patch('/api/articles')
        .expect(405)
        .then((res) => {
          expect(res.body.msg).to.equal('The method is not handled for this route');
        }));
    });
  });

  describe('/api/articles/:article_id/comments', () => {
    describe('GET /api/articles/:article_id/comments', () => {
      it('Returns the comments of a given article id with reqd keys', () => request
        .get('/api/articles/1/comments')
        .expect(200)
        .then((res) => {
          const { comments } = res.body;
          expect(comments).to.be.an('array');
          expect(comments[0]).to.be.an('object');
          expect(comments[0]).to.contain.keys('comment_id', 'votes', 'author', 'created_at', 'body');
        }));
      it('Returns the comments of a given article id with reqd keys in reqired order', () => request
        .get('/api/articles/1/comments?sort_by=comment_id&order=asc')
        .expect(200)
        .then((res) => {
          const { comments } = res.body;
          expect(comments).to.be.an('array');
          expect(comments[0]).to.be.an('object');
          expect(comments[0]).to.contain.keys('comment_id', 'votes', 'author', 'created_at', 'body');
          expect(comments[0].comment_id).to.be.lessThan(comments[1].comment_id);
        }));

      it('Returns top 3 comments of a given article id', () => request
        .get('/api/articles/1/comments?sort_by=comment_id&order=asc&limit=3')
        .expect(200)
        .then((res) => {
          const { comments } = res.body;
          expect(comments.length).to.equal(3);
          expect(comments[0].comment_id).to.equal(2);
          expect(comments[1].comment_id).to.equal(3);
          expect(comments[2].comment_id).to.equal(4);
        }));

      it('Returns second 3 comments of a given article id', () => request
        .get('/api/articles/1/comments?sort_by=comment_id&order=asc&limit=3&p=2')
        .expect(200)
        .then((res) => {
          const { comments } = res.body;
          expect(comments.length).to.equal(3);
          expect(comments[0].comment_id).to.equal(5);
          expect(comments[1].comment_id).to.equal(6);
          expect(comments[2].comment_id).to.equal(7);
        }));

      it('Returns 404 when fetching comments for article that has no comments', () => request
        .get('/api/articles/1232323/comments')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('Article does not exist for given article id: 1232323');
        }));

      it('Returns 400 when fetching comments for invalid article id', () => request
        .get('/api/articles/hola/comments')
        .expect(400)
        .then((res) => {
          expect(res.body.msg).to.equal('The article id must be provided in the url like: api/articles/123/comments and must be an integer');
        }));
    });

    describe('POST /api/articles/:article_id/comments', () => {
      const commentObj = {
        username: 'butter_bridge',
        body: 'Tacocat is so cool!',
      };

      it('Returns 200 and posted comment for existing article', () => request
        .post('/api/articles/1/comments')
        .send(commentObj)
        .expect(201)
        .then((res) => {
          const { comment } = res.body;
          expect(comment.article_id).to.equal(1);
          expect(comment.body).to.equal(commentObj.body);
          expect(comment.author).to.equal(commentObj.username);
        }));
      it('Returns 404 when posting comments without a body', () => {
        const comment = {
          username: 'butter_bridge',
        };
        return request
          .post('/api/articles/1/comments')
          .send(comment)
          .expect(400)
          .then((res) => {
            expect(res.body.msg).to.equal('JSON needs a username and body');
          });
      });
      it('Returns 404 when posting comments for non-existent user', () => {
        const comment = {
          username: 'butter_x_bridge',
          body: 'Tacocat is so cool!',
        };
        return request
          .post('/api/articles/1/comments')
          .send(comment)
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Key (author)=(butter_x_bridge) is not present in table "users".');
          });
      });
      it('Returns 404 when posting comments for non-existent article', () => request
        .post('/api/articles/1232323/comments')
        .send(commentObj)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('Key (article_id)=(1232323) is not present in table "articles".');
        }));

      it('Returns 400 when posting comments for non-existent article', () => request
        .post('/api/articles/banana/comments')
        .send(commentObj)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).to.equal('The article id must be provided in the url like: api/articles/123/comments');
        }));
    });
  });

  describe('/api/articles/:article_id', () => {
    describe('GET /api/articles/:article_id', () => {
      it('Returns the article object with appropriate keys for an existing article', () => request
        .get('/api/articles/1')
        .expect(200)
        .then((res) => {
          const { article } = res.body;
          expect(article).to.contain.keys('article_id', 'title', 'topic', 'votes', 'author', 'created_at', 'comment_count', 'body');
          expect(article.article_id).to.equal(1);
        }));

      it('Returns error for non-existent article', () => request
        .get('/api/articles/73687')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('Article does not exist for given article id: 73687');
        }));

      it('Returns error for invalid article id (str instead of int)', () => request
        .get('/api/articles/hola')
        .expect(400)
        .then((res) => {
          expect(res.body.msg).to.equal('Article id: hola must be an integer.');
        }));
    });

    describe('PATCH /api/articles/:article_id', () => {
      const increaseVote = { inc_votes: 1 };
      const decreaseVote = { inc_votes: -5 };

      it('Returns 200 with the updated article object with new increased votes', () => {
        const newVote = 101;
        return request
          .patch('/api/articles/1')
          .send(increaseVote)
          .expect(200)
          .then((res) => {
            const updatedArticle = res.body.article;
            expect(updatedArticle.article_id).to.equal(1);
            expect(updatedArticle.votes).to.equal(newVote);
          });
      });

      it('Returns 200 with the updated article object with new decreased votes', () => {
        const newVote = 95;
        return request
          .patch('/api/articles/1')
          .send(decreaseVote)
          .expect(200)
          .then((res) => {
            const updatedArticle = res.body.article;
            expect(updatedArticle.article_id).to.equal(1);
            expect(updatedArticle.votes).to.equal(newVote);
          });
      });

      it('Returns 404 when updating a non-existent article', () => request
        .patch('/api/articles/1232323')
        .send(decreaseVote)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('Article does not exist for given article id: 1232323');
        }));

      it('Returns 200 and unmodified article if no inc_votes is provided', () => request
        .patch('/api/articles/1')
        .send({})
        .expect(200)
        .then(({ body }) => {
          expect(body.article.article_id).to.equal(1);
        }));

      it('Returns 400 error for article vote set to non-integer', () => request
        .patch('/api/articles/1')
        .send({ inc_votes: 'wii' })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).to.equal('Bad Request. inc_votes must be provided and must be an integer');
        }));
    });

    // TODO do a check to see if article_id is still there?
    describe('DELETE /api/articles/:article_id', () => {
      it('Returns 204 after it deletes an article', () => request
        .delete('/api/articles/1')
        .expect(204));
      it('Returns 400 for non-integer article id', () => request
        .delete('/api/articles/hola')
        .expect(400)
        .then((res) => {
          expect(res.body.msg).to.equal('The article id must be an integer and provided in the url like: api/articles/123');
        }));
      it('Returns 400 for non existent int article id', () => request
        .delete('/api/articles/12345')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('The article id 12345 does not exist in the database.');
        }));
    });
  });

  describe('/api/comments/:comment_id', () => {
    describe('PATCH /api/comments/:comment_id', () => {
      const increaseVote = { inc_votes: 1 };
      const decreaseVote = { inc_votes: -5 };
      const comment = {
        comment_id: 1,
        author: 'butter_bridge',
        article_id: 9,
        votes: 16,
        created_at: '2017-11-22T12:36:03.389Z',
        body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      };


      it('Returns 200 with the updated comment object with new increased  votes', () => {
        const newVote = 17;
        return request
          .patch('/api/comments/1')
          .send(increaseVote)
          .expect(200)
          .then((res) => {
            const updatedComment = res.body.comment;
            expect(updatedComment.comment_id).to.equal(comment.comment_id);
            expect(updatedComment.votes).to.equal(newVote);
          });
      });

      it('Returns 200 with the updated comment object with new decreased votes', () => {
        const newVote = 11;
        return request
          .patch('/api/comments/1')
          .send(decreaseVote)
          .expect(200)
          .then((res) => {
            const updatedComment = res.body.comment;
            expect(updatedComment.comment_id).to.equal(comment.comment_id);
            expect(updatedComment.votes).to.equal(newVote);
          });
      });

      it('Returns 404 when updating a non-existent comment', () => request
        .patch('/api/comments/1232323')
        .send(decreaseVote)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('The comment_id 1232323 does not exist.');
        }));

      it('Returns 200 inc_votes is not sent', () => request
        .patch('/api/comments/1')
        .send({})
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.comment_id).to.equal(1);
        }));
      it('Returns 400 inc_votes is not an integer', () => request
        .patch('/api/comments/1')
        .send({ inc_votes: 'something' })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).to.equal('The inc_votes must be provided and must be integer');
        }));
    });

    // TODO do a check to see if comment_id is still there?
    describe('DELETE /api/comments/:comment_id', () => {
      it('Returns 204 after it deletes a comment', () => request
        .delete('/api/comments/1')
        .expect(204));

      it('Returns 404 error for non-existent comment id', () => request
        .delete('/api/comments/3431')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('The comment_id 3431 does not exist.');
        }));
    });

    describe('GET /api/comments/:comment_id', () => {
      it('Returns with 405 and unhandled method error', () => request
        .get('/api/comments/34')
        .expect(405)
        .then((res) => {
          expect(res.body.msg).to.equal('The method is not handled for this route');
        }));
    });
  });

  describe('/api/users', () => {
    describe('GET /api/users', () => {
      it('Returns status 200 with an array of user objects with appropriate keys', () => request
        .get('/api/users')
        .expect(200)
        .then((res) => {
          const { users } = res.body;
          expect(users).to.be.an('array');
          expect(users[0]).to.be.an('object');
          expect(users[0]).to.contain.keys('username', 'avatar_url', 'name');
        }));
    });

    describe('POST /api/users', () => {
      it('Returns status 201 with the new user created', () => {
        const newUser = { username: 'shumanator', avatar_url: 'https://wwww.someurl.com', name: 'shumi' };
        return request
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .then((res) => {
            const { user } = res.body;
            expect(user).to.deep.equal(newUser);
          });
      });

      it('Returns error 400 for json without username', () => {
        const newUser = { avatar_url: 'https://wwww.someurl.com', name: 'shumi' };
        return request
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .then((res) => {
            expect(res.body.msg).to.equal('The username is missing in json.');
          });
      });

      it('Returns 400 error for posting a username that already exist', () => {
        const newUser = { username: 'butter_bridge', avatar_url: 'https://wwww.someurl.com', name: 'shumi' };
        return request
          .post('/api/users')
          .send(newUser)
          .expect(422)
          .then((res) => {
            expect(res.body.msg).to.equal('Key (username)=(butter_bridge) already exists.');
          });
      });
    });

    describe('PATCH /api/users', () => {
      it('Returns with 405 and unhandled method error', () => request
        .patch('/api/users')
        .expect(405)
        .then((res) => {
          expect(res.body.msg).to.equal('The method is not handled for this route');
        }));
    });
  });

  describe('/api/users/:username', () => {
    describe('GET /api/users/:username', () => {
      it('Returns status 200 with the user object for given username', () => {
        const expectedUser = { username: 'butter_bridge', avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg', name: 'jonny' };
        return request
          .get('/api/users/butter_bridge')
          .expect(200)
          .then((res) => {
            const { user } = res.body;
            expect(user).to.deep.equal(expectedUser);
          });
      });

      it('Returns status 404 and error if user is not found', () => request
        .get('/api/users/butter_bridg3e')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('User does not exist with username butter_bridg3e');
        }));
    });
    describe('POST /api/users/:username', () => {
      it('Returns with 405 and unhandled method error', () => request
        .post('/api/users/butter_bridge')
        .expect(405)
        .then((res) => {
          expect(res.body.msg).to.equal('The method is not handled for this route');
        }));
    });
  });
});
