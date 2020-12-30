const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Hello world
app.get("/", (req, res) => {
  res.send("Hello World.")
})

// listen on the port
app.listen(port);