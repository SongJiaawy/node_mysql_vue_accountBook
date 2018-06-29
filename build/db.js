const config = require('../config')
const mysql = require('mysql')
const express = require('express')
//初始化mysql
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'songjia',
  database: 'my_account',
  multipleStatements: true//同时查询多条sql
})

const query = (sql, callback) => {
  pool.getConnection((error, connection) => {
    connection.query(sql, (err, rows) => {
      connection.release()
      callback(err, rows)
    })
  })
}

module.exports.query = query
