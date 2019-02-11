const articleRows = [{
  article_id: 1,
  title: 'Something Funny',
  body: 'I am very funny',
  votes: 1,
  topic: 'Comedy',
  author: 'harry',
  created_at: '2016-08-18 13:07:52.389+01',
},
{
  article_id: 2,
  title: 'Something very Funny',
  body: 'I am very funny',
  votes: 1,
  topic: 'Comedy',
  author: 'garry',
  created_at: '2016-08-18 13:07:52.389+01',
},
{
  article_id: 3,
  title: 'Something really Funny',
  body: 'I am very funny',
  votes: 1,
  topic: 'Comedy',
  author: 'barry',
  created_at: '2016-08-18 13:07:52.389+01',
}];

const preFormattedArticleRows = [
  {
    title: 'Running a Node App',
    topic: 'coding',
    author: 'jessjelly',
    body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
    created_at: 1471522072389,
  },
  {
    title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
    topic: 'coding',
    author: 'jessjelly',
    body:
          'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
    created_at: 1500584273256,
  },
];

const comments = [{
  body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
  belongs_to: 'Something really Funny',
  created_by: 'harry',
  votes: -1,
  created_at: 1468087638932,
},
{
  body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
  belongs_to: 'Something Funny',
  created_by: 'barry',
  votes: 7,
  created_at: 1478813209256,
}];

const commentsWithBadData = [{
  body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
  belongs_to: 'Something really Funny',
  created_by: 'harry',
  votes: -1,
  created_at: 1468087638932,
},
{
  body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
  belongs_to: 'BAAAA really Funny',
  created_by: 'harry',
  votes: -1,
  created_at: 1468087638932,
},
{
  body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
  belongs_to: 'Something Funny',
  created_by: 'barry',
  votes: 7,
  created_at: 1478813209256,
}];

const formattedComments = [
  {
    body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
    author: 'harry',
    article_id: 3,
    votes: -1,
    created_at: new Date(1468087638932),
  },
  {
    body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
    article_id: 1,
    author: 'barry',
    votes: 7,
    created_at: new Date(1478813209256),
  },
];
module.exports = {
  articleRows, preFormattedArticleRows, comments, formattedComments, commentsWithBadData,
};
