const puppeteer = require('puppeteer');

const getStat = async function(symbol){
  let url = `https://www.gurufocus.com/stock/${symbol}/summary`

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const html = await page.content();

  // Get the content here
  console.log(html)

  await browser.close();
}

getStat("U")