const app = require('./express');

const port = 3001;

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
