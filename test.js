const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('0a6577192bf547c595947485d4d9076f');
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
newsapi.v2.topHeadlines({
  q: 'bitcoin',
  category: 'business',
  language: 'en',
  country: 'us'
}).then(response => {
  console.log(response.articles[0].url);
  /*
    {
      status: "ok",
      articles: [...]
    }
  */
});
// To query /v2/everything
// You must include at least one q, source, or domain

