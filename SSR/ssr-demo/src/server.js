const express = require('express');
const ReactDOMServer = require('react-dom/server');
const React = require('react');
const path = require('path');

const Counter = require('./App.jsx').default;


const app = express();

app.get('/', (req, res) => {
  const html = ReactDOMServer.renderToString(<Counter />);
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Counter</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="/bundled-client.js"></script>
      </body>
    </html>
  `);
});


app.use(express.static(path.resolve(__dirname, '../dist')));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});