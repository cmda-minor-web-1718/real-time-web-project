var database = require('../db')
var sequelize = database.sequelize

const User = sequelize.define("user", {
    userName: {
      type: Sequelize.STRING
    },
    spotifyCode: {
      type: Sequelize.STRING(2550)
    },
    color: {
      type: Sequelize.STRING
    }
  });
  
  User.sync({ force: true }).then(() => {
    return User.create({
      userName: "freek",
      spotifyCode:
        "AQCTabvcmmU347eShVcvFFqdFN8MKgr2ep_XBbGZ_JT4t2kyYgXkXz0N0h-VV0l_Se8L8Rqv2w3jCARye1S-2H60szVolTAuWO9m6Pl6T35xNfRxiTtEhupt1qamsrkm2rx46q_rBEPFHHwIec27Ab0X-QoOm3JwFLH-iIIii5r4jUHp5fZznU1QVeiFnl3I2kFUW0lLRaIK6qS1dwvWGF7Kbf0W_kySlBTYXmkKu_xAQsfs6ZuanA",
      color: "#fff"
    });
  });