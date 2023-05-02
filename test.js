const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
	apiKey: "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",
});

const openai = new OpenAIApi(config);

const runPrompt = async (url) => {
	const prompt = `
    Summarize this article in 3 different lengths, one short, one medium, and one long: ${url}
    `;

	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: prompt,
		max_tokens: 2048,
		temperature: 1,
	});
    article = response.data.choices[0].text
    const shortSummary = article.split("Short: ")[1].split("\n")[0];
    const mediumSummary = article.split("Medium: ")[1].split("\n")[0];
    const longSummary = article.split("Long: ")[1].split("\n")[0];
  return {shortSummary, mediumSummary, longSummary};
};
 




async function fetchArticles(topic) {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastyear = lastWeek.getFullYear();
    const lastmonth = String(lastWeek.getMonth() + 1).padStart(2, '0');
    const lastday = String(lastWeek.getDate()).padStart(2, '0');
    const lastWeekFormatted = `${lastyear}-${lastmonth}-${lastday}`;
    let arr = [];
    const response = await fetch(`https://newsapi.org/v2/everything?q=${topic}&from=${todayFormatted}&to=${lastWeekFormatted}&sortBy=popularity&apiKey=b96538face724581aae3298f379c3895`);
    const data = await response.json();
    let articles = data.articles;
    for(let i=0; i<1; i++) {
      let shortSummary,mediumSummary,longSummary;
      try {
        const result = await runPrompt(articles[i].url);
        shortSummary = result.shortSummary;
        mediumSummary = result.mediumSummary;
        longSummary = result.longSummary;
      } catch(error) {
        console.error(error);
      }
      arr.push({
        title: articles[i].title,
        category: topic,
        url: articles[i].url,
        imageurl: articles[i].urlToImage,
        shortsummary: shortSummary,
        mediumsummary: mediumSummary,
        longsummary: longSummary
      });
    }
    return arr;
  } catch(error) {
    console.error(error);
  }
}

// Call the function and print the result
fetchArticles('bitcoin').then(result => {
  console.log(result);
}).catch(error => {
  console.error(error);
});