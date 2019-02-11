const { expect } = require('chai');
const {
  formatArticles, formatComments, getArticleIds, getArticleId,
} = require('../db/utils/index');
const {
  articleRows, preFormattedArticleRows, formattedComments, comments, commentsWithBadData,
} = require('../data-for-spec/data');

describe('getArticleIds', () => {
  it('Given array of articles, returns object with article id and title only', () => {
    const expected = [{ article_id: 1, title: 'Something Funny' }, { article_id: 2, title: 'Something very Funny' }, { article_id: 3, title: 'Something really Funny' }];
    const actual = getArticleIds(articleRows);
    expect(actual).to.deep.equal(expected);
  });
});

describe('getArticleId', () => {
  it('Given array of articles, returns article id which matches title', () => {
    const expected = 1;
    const actual = getArticleId('Something Funny', getArticleIds(articleRows));
    expect(actual).to.equal(expected);
  });


  it('Given array of articles, returns -1 if article title has no match', () => {
    const expected = -1;
    const actual = getArticleId('I do not exist', getArticleIds(articleRows));
    expect(actual).to.equal(expected);
  });
});

describe('formatArticles', () => {
  it('Given array of articles, returns array but with created_at reformatted to proper date time', () => {
    const expected = new Date(preFormattedArticleRows[0].created_at);
    const actual = formatArticles(preFormattedArticleRows)[0].created_at;
    expect(actual).to.deep.equal(expected);
  });
});

describe('formatComments', () => {
  it('Given array of comments, returns array of comments with updated keys and matched article id', () => {
    const actual = formatComments(comments, getArticleIds(articleRows));
    expect(actual).to.deep.equal(formattedComments);
  });

  it('Given array of comments, does not include comment without a matching title', () => {
    const actual = formatComments(commentsWithBadData, getArticleIds(articleRows));
    expect(actual).to.deep.equal(formattedComments);
  });
});
