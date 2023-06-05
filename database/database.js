const Sequelize = require("sequelize");

const connection = new Sequelize('mensagem', 'root', 'Hery**6752', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection;