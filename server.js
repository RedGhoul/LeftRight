if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const methodOverride = require('method-override');

const { GetHeadLine } = require('./routes/router_newssites');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

app.post('/headline', checkNotAuthenticated, GetHeadLine);

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log("Connected ! " + process.env.PORT + ' 0.0.0.0');
})
