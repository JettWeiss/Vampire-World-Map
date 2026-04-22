function main() {
    const http = require('http');
    const fs = require('fs');
    const path = require('path');

    const indexPath = path.join(__dirname, '..', 'index.html');
    console.log(indexPath)
    const server = http.createServer((req, res) => {
        if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
            fs.stat(indexPath, (err, stats) => {
                if (err || !stats.isFile()) {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    return res.end('Not Found');
                }
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                fs.createReadStream(indexPath).pipe(res);
            });
            return;
        }

        const filePath = path.join(__dirname, '..', req.url);
        const extMap = {
            '.json': 'application/json',
            '.js':   'application/javascript',
            '.css':  'text/css',
            '.html': 'text/html'
        };
        const contentType = extMap[path.extname(filePath)] || 'text/plain';

        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                return res.end('Not found');
            }
            res.writeHead(200, {'Content-Type': contentType});
            fs.createReadStream(filePath).pipe(res);
        });
    });

    const PORT = 3000;
    server.listen(PORT, 'localhost', () => {
        console.log('Running server on http://localhost:' + PORT + '/');
    });
}

main();