
const convertFromEpoch = epochTime => new Date(epochTime);

const getArticleIds = articlesRows => articlesRows.map((articleRow) => {
  const articleObj = {
    title: articleRow.title,
    article_id: articleRow.article_id,
  };
  return articleObj;
});

const getArticleId = (title, articleIdList) => {
  const article = articleIdList.filter(articlesRow => articlesRow.title === title);
  return article[0].article_id;
};

const formatArticles = (articles) => {
  articles.forEach((article) => {
    const epochTime = article.created_at;
    article.created_at = convertFromEpoch(epochTime);
  });
  return articles;
};

const formatComments = (comments, articlesRows) => {
  comments.forEach((comment) => {
    const epochTime = comment.created_at;
    comment.created_at = convertFromEpoch(epochTime);

    const author = comment.created_by;
    delete comment.created_by;
    comment.author = author;

    const article_id = getArticleId(comment.belongs_to, articlesRows);
    delete comment.belongs_to;
    comment.article_id = article_id;
  });
  return comments;
};

module.exports = { formatArticles, formatComments, getArticleIds };
