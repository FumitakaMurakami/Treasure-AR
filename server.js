var path = require("path");
var http = require("http");
var html = require("fs").readFileSync("index.html");
let express = require("express");
console.log(express);
let app = express();
app.use("/", express.static(path.resolve("./")));
const server = app.listen(8080, () => {
  console.log("start server");
});
