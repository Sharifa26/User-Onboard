const express = require("express");
const models = require('./models/sequelize');

// body parser
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", require('./router/url'));

// Connect to Mysql Database
global.dbConnection = models.sequelize;

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});