var http = require('http');
var fs = require('fs');
var path = require('path');
var util = require('util');
var state = 'OFF';

http.createServer(function (request, response) {
	var filePath = '../..' + request.url;
	if (filePath == '../../'){
        filePath = '../../index.html';
	}

    var extname = path.extname(filePath);
	var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
	fs.readFile(filePath, function(error, content) {
        if (error) {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        
        else {
		    response.writeHead(200, { 'Content-Type': contentType });
			response.write(content, 'utf-8');
			response.end();
        }
    });	
	 
}).listen(8080);