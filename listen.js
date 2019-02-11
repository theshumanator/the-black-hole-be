const app = require('./app');

const PORT = 9090;

app.listen(PORT, (err) => {
  if (err) console.log('ERROR', err);
  else console.log(`server listening on port ${PORT}`);
});
