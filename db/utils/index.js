
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
  if (article.length > 0) {
    return article[0].article_id;
  }
  return -1;
};

const formatArticles = (articles) => {
  articles.forEach((article) => {
    const epochTime = article.created_at;
    article.created_at = convertFromEpoch(epochTime);
  });
  return articles;
};

const formatComments = (comments, articlesRows) => {
  const formattedComments = [];
  comments.forEach((comment) => {
    const article_id = getArticleId(comment.belongs_to, articlesRows);
    if (article_id !== -1) {
      const newComment = {};
      const epochTime = comment.created_at;
      comment.created_at = convertFromEpoch(epochTime);
      newComment.created_at = convertFromEpoch(epochTime);
      newComment.article_id = article_id;
      newComment.author = comment.created_by;
      newComment.body = comment.body;
      newComment.votes = comment.votes;

      formattedComments.push(newComment);
    }
  });
  return formattedComments;
};

module.exports = {
  formatArticles, formatComments, getArticleIds, getArticleId,
};
