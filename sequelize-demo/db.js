const Sequelize = require("sequelize");

const sequelize = new Sequelize("sequelize-demo", "root", "myprogram", {
    dialect: "mysql"
});

module.exports = sequelize;