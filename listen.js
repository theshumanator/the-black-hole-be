const app = require('./app');

const PORT = process.env.PORT || 9090;

app.listen(PORT, (err) => {
  console.log(process.env.NODE_ENV);
  if (err) console.log('ERROR', err);
  else console.log(`server listening on port ${PORT}`);
});
