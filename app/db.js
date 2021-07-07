const Sequelize = require("sequelize");
require("dotenv").config();
var sequelize = new Sequelize(
    process.env.POSTGRES_DATABASE, 
    process.env.POSTGRES_USER, 
    process.env.POSTGRES_PASSWORD, {
    host: "localhost",
    dialect: "postgres",
    operatorsAliases: false,
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })
  

exports.sequelize = sequelize;

exports.initDB = function initDB(){
    sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    })
}
  