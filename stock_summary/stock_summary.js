const {runModule, labels} = require("./stock_crawler")
const { Parser } = require('json2csv');
const fs = require('fs');

const outputPath="stock_summary.csv"
const symbolList=[
  "U","INTC"
]

runModule(symbolList).then((result) => {
  try {
    const parser = new Parser(labels);
    const csv = parser.parse(result);
    console.log(csv);
    fs.writeFileSync(outputPath, csv);
  } catch (err) {
    console.error(err);
  }
})
