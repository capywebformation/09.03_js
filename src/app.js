const http = require('http');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
  // let url = req.url;
  let {url} = req;

  if(url === "/"){
    res.end("Home");
  }
  else if(url === "/posts"){
    res.end("Liste des articles");
  }


  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'text/plain');
  // res.end('Hello World');
});

server.listen(port, hostname);
