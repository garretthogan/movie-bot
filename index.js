const express = require('expresss');

const PORT = process.env.PORT || 8080;
const app = express();

app.get('/slack', (req, res) => {
  res.send('Hello world!');
});

app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
});
