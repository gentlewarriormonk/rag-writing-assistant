// Custom server implementation with port logging
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  let actualPort = PORT;
  
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  
  // Try to listen on the preferred port, or use an available one
  server.listen(PORT, (err) => {
    if (err) {
      console.error('Error starting server:', err);
      return;
    }
    
    actualPort = server.address().port;
    
    // Make the port info very visible in the console
    console.log(`
==============================
🚀 Kaku is running on: http://localhost:${actualPort}
==============================
    `);
  });
  
  // Handle graceful shutdown
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      console.log('Shutting down server...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  });
}); 