
const convertFromEpoch = epochTime => new Date(epochTime);

const formatArticles = (articles) => {
  articles.forEach((article) => {
    const epochTime = article.created_at;
    article.created_at = convertFromEpoch(epochTime);
  });
  return articles;
};

module.exports = { convertFromEpoch, formatArticles };

/*
Articles:
change created at
 {
    title: 'Running a Node App',
    topic: 'coding',
    author: 'jessjelly',
    body:
      'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
    created_at: 1471522072389,
  }

*/
