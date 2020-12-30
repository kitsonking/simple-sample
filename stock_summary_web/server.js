const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {runModule, labels} = require("./stock_crawler")
const app = express();
const port = 8000;

const resultMap = {}
const cfg_result_timeout=300000

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
    // generate a id for this request
    var id = String((new Date()).getTime() ) + String(Math.trunc(Math.random()*100000))
    resultMap[id] = {
      status: "loading"
    }

    // get symbol list
    var symbols = req.params.symbols.split(",").map(function(item) {
      return item.trim();
    });
    console.log("Process " + symbols)

    // run module
    const pm = runModule(symbols)

    // send the id back to client
    res.send({
      id: id
    })

    pm.then((val) => {
      // put the result to the result map
      console.log(`result for ${id} added.`)
      resultMap[id] = {
        status: "finish",
        value: val
      }

      // delete result after a period
      setTimeout(() => {
        delete resultMap[id]
        console.log(`result for ${id} deleted.`)
      }, cfg_result_timeout);  
    })
  }
})

app.get("/read/:id", (req, res) => {
  if(resultMap[req.params.id]){
    res.setHeader('Content-Type', 'application/json');
    res.send(resultMap[req.params.id])
  } else {
    res.send({
      status: "invalid"
    })
  }
})

// listen on the port
app.listen(port);