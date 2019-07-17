// Load the http module
const http = require("http");

const hostname = "127.0.0.1";
const port = 8000;

// Create the HTTP server
const server = http.createServer( (req, res) => {
    // Set the response HTTP header with HTTP status and Content-type
    res.writeHead(200, {'Content-Type': 'text/plain'});

    // Set the reponse body with "Hello World"
    res.end('Hello World ! How are you today ? \n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})