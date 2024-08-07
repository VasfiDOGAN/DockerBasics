const http = require('http');
const mysql = require('mysql2');

// Veritabanı bağlantı yapılandırması
const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123123123',
  database: process.env.DB_NAME || 'mydatabase'
};

const connectWithRetry = () => {
  console.log('Veritabanına bağlanmaya çalışılıyor...');
  const db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error('Veritabanı bağlantı hatası:', err);
      setTimeout(connectWithRetry, 5000); // 5 saniye sonra yeniden dene
    } else {
      console.log('MySQL veritabanına başarıyla bağlandı.');
      startServer(db);
    }
  });
};

const startServer = (db) => {
  const hostname = '0.0.0.0';
  const port = 3000;

  const server = http.createServer((req, res) => {
    if (req.url === '/products') {
      db.query('SELECT * FROM products', (err, results) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Veritabanı hatası' }));
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(results));
        }
      });
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hello World\n');
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
};

connectWithRetry();
