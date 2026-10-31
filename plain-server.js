// Plain Node.js server using the built-in http module.
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Hello");
});

server.listen(3000, () => {
  console.log("Plain HTTP server is running at http://localhost:3000");
});
