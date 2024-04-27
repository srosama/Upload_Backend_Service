const http = require('http');
const fs = require('fs');
const { ModelSER } = require('./moduleSER');

const { Client } = require('pg');
const { json } = require('stream/consumers');

// Connection information
const connectionString = 'postgresql://postgres:osama12@localhost:5432/upload';
const client = new Client({
    connectionString: connectionString
});
client.connect()



const server = http.createServer(async (req, res) => {
    if (req.url === "/") {
        res.setHeader('Content-Type', 'text/html');
        const htmlContent = fs.readFileSync("index.html", 'utf8');
        res.end(htmlContent);
    } else if (req.url === "/style.css") {
        res.setHeader('Content-Type', 'text/css');
        const cssContent = fs.readFileSync("style.css", 'utf8');
        res.end(cssContent);
    } 
    
    else if (req.url === "/add_name" && req.method === 'POST') {
        // Handle adding a name to the database
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', async () => {
            const name = JSON.parse(body).name;
            const model = new ModelSER(client);
            console.log(typeof(name));
            try {
                await model.add_names(name);
                res.end("Name added!");
            } catch (error) {
                console.error('Error adding name:', error);
                res.statusCode = 500; // Internal Server Error
                res.end("Error adding name to the database");
            }
        });
    }
     
    else if (req.url === "/get_names" && req.method === 'GET') {
        const model = new ModelSER(client);
        try {
          const names = await model.get_names();
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(names));
        } catch (error) {
          console.error('Error retrieving names:', error);
          res.statusCode = 500; // Internal Server Error
          res.end("Error retrieving names from the database");
        }
      }


    else if (req.url === "/main") {
        res.setHeader('Content-Type', 'text/html');
        const htmlContent = fs.readFileSync("main.html", 'utf8');
        res.end(htmlContent);
    } else if (req.url === "/upload" && req.method === 'POST') {
        const fileName = req.headers["file-name"];
        const writeStream = fs.createWriteStream(fileName);
        req.pipe(writeStream);
        req.on('end', () => {
            res.end("Uploaded!");
        });
    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
