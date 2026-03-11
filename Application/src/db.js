const { Pool } = require('pg')
require('dotenv').config()

let instance = null

function getDB() {
  if (!instance) {
    instance = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    })
  }
  return instance
}

module.exports = getDB