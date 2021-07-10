var express = require("express");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var path = require("path");
var compression = require("compression");

var app = express();
app.use(methodOverride());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const buildEnv = process.env.NODE_ENV || "staging";

app.use(express.static(path.join(__dirname, `../dist/${buildEnv}`)));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const fs = require("fs");

const htmlTemplateForVisualization = fs.readFileSync(
  path.join(__dirname, `../dist/${buildEnv}/index.html`), "utf8");
app.get("/*", function(req, res) {
    res.send(htmlTemplateForVisualization);
})

// ==== start listen ====
var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
  console.log(
    "[Client VIS] listening on port " +
      port +
      " - " +
      process.env.NODE_ENV
  );
});
