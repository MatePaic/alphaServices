const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const path = require('path');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());

app.set('view engine', 'ejs');

//Middleware
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

//Routers
const bikesRouter = require('./routes/bikes');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');

const api = process.env.API_URL;

app.use(`${api}/bikes`, bikesRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/users`, usersRouter);

//Connection to database
mongoose
  .connect(
    'mongodb+srv://matepaic:' + process.env.CONNECTION_PASSWORD + '@cluster0.2sc28.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

//listening to 3000 port
app.listen(3000, () => {
    console.log(api);
    console.log('server is running http://localhost:3000');
})