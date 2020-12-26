const puppeteer = require('puppeteer');
const $ = require('cheerio');

const getData = function(html){
  var finStrength = $("a:contains('Financial Strength')", html).closest("td").next().text().trim();
  return {
    finStrength: finStrength
  }
}

const getStat = async function(symbol){
  let url = `https://www.gurufocus.com/stock/${symbol}/summary`

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const html = await page.content();

  // Get the content here
  var result = Object.assign({ "symbol": symbol}, getData(html));

  await browser.close();
  return result
}

const runModule = async function(symbolList){
  var promises=[]
  for(i in symbolList){
    promises.push(getStat(symbolList[i]))
  }

  pm=new Promise((resolutionFunc,rejectionFunc) => {
    Promise.all(promises).then((value) => {
      resolutionFunc(value)
    })
  })
  return pm
}

runModule(["HD", "AAPL", "GOOGL"]).then((result) => {
  console.log(JSON.stringify(result))
})
