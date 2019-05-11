const express = require('express');

const app = express();
const path = require('path');

const PORT = process.env.PORT || 8080;

const buildPath = path.resolve(__dirname, 'build');

app.use(express.static(buildPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
