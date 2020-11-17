// server.js

const app = require('express')();

app.use('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.listen(5000);