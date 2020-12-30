const puppeteer = require('puppeteer');
const $ = require('cheerio');

var labels = [
  'Financial Strength',
  'Profitability Rank',
  'Cash-To-Debt',
  'Equity-to-Asset',
  'Operating Margin %',
  'Net Margin %',
  'ROA %',
]

const getData = function(html){
  var result = {}
  for(l in labels){
    var label = labels[l]
    result[label]=$("a:contains('"+label+"')", html).closest("td").next().text().trim();
  }
  return result
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

exports.runModule=runModule
exports.labels=labels