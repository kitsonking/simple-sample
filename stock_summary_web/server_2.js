const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {runModule, labels} = require("./stock_crawler")
const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Hello world
app.get("/", (req, res) => {
  res.send("Hello World.")
})

app.get("/get/:symbols", (req, res) => {
  if(!req.params.symbols){
    // symbols not provided
    res.send("Symbols not found.")
  } else if(req.params.symbols.length == 0){
    // symbol list empty
    res.send("Symbols empty.")
  } else {
    // get symbol list
    var symbols = req.params.symbols.split(",").map(function(item) {
      return item.trim();
    });
    console.log("Process " + symbols)

    // run module
    const pm = runModule(symbols)
    pm.then((val) => {
      // send result
      res.send(JSON.stringify({
        status: "finish",
        value: val
      }))
    })
  }
})

// listen on the port
app.listen(port);