const express = require('express');

const bodyparser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const commentRoute = require('./route/commentRoutes');
const themeRoute = require('./route/themeRoute')
const topicRoute = require('./route/topicRoutes')
const memberRoute = require('./route/memberRoute')
const regionRoute = require('./route/regionRoute')

const path = require('path');
const { constants } = require('buffer');
const PORT = process.env.PORT || 5000;
const HOST = process.env.Host;
const app = express();

const connectionUrl = "mongodb://127.0.0.1:27017/shopdb";
//TODO
mongoose
  .connect(connectionUrl
    , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true
    })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("Connection failed!");
  });
// Connect to MongoDB
/*mongoose
    .connect(connectionUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log("Connected to the database");
    })
    .catch(() => {
        console.log("Connection failed!");
    });*/




app.use(cors());
app.use(logger('dev'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));



//app.use('/', express.static(path.join(__dirname,'public')));

/*app.get('', (req,res)=>{
  res.sendFile(path.join(__dirname,'public','index.html'));
})*/



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:19000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use(commentRoute);
app.use(themeRoute);
app.use(topicRoute);
app.use(memberRoute);
app.use(regionRoute);


app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
