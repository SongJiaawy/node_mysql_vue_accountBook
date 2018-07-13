const db = require('./db')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const appService = (app) => {
  app.set('superSecret', 'sjSecret')
  app.use(bodyParser.json())
  app.use('/api', (req, res, next) => {
    if (req.path !== '/login' && req.path !== '/register') {
      let token = req.body.token || req.query.token || req.headers['x-access-token'];
      if (token) {
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
          if (err) {
            return res.json({success: false, message: 'Failed to authenticate token.'});
          } else {
            db.query(`select * from user_list where user_name = "${decoded.name}"`, (err, rows) => {
              req.user_id = rows[0].user_id
              next()
            })
          }
        });
      } else {
        return res.status(403).send({
          success: false,
          message: 'No token provided.'
        });
      }
    } else {
      next()
    }
  })
  app.use(bodyParser.urlencoded({extended: false}))
  app.get('/api/total', (req, res) => {
    db.query(`select * from income where login_user = "${req.user_id}"and date between "${ req.query.start} " and "${req.query.end}";
    select * from expend where login_user = "${req.user_id}" and date between "${req.query.start}" and "${req.query.end}";
    select * from my_account where login_user = "${req.user_id}"`, (err, rows) => {
      if (err) {
        res.json({
          status: 0,
          data: {}
        })
      } else {
        let data = []
        rows.map((row, index) => {
          let amount = 0
          let list = []
          let dataObj = {}
          row.map((value, idx) => {
            if (dataObj[value.account_name + value.account_user]) {
              dataObj[value.account_name + value.account_user].amount += value.amount
            }else {
              dataObj[value.account_name + value.account_user] = {}
              dataObj[value.account_name + value.account_user].amount = value.amount
              dataObj[value.account_name + value.account_user].user = value.account_user
              dataObj[value.account_name + value.account_user].account_name = value.account_name
            }
            amount += value.amount
          })
          if(index == 2) {
            for (let accountName in dataObj) {
              list.push({
                account_name: dataObj[accountName].account_name,
                account_user: dataObj[accountName].user,
                total: dataObj[accountName].amount
              })
            }
          } else {
            let data = {}
            for (let accountName in dataObj) {
              data[accountName] = dataObj[accountName].amount
            }
            list = data
          }
          data.push({
            total: amount,
            list: list
          })
        })
        res.json({
          status: 1,
          data: {
            income: data[0],
            expend: data[1],
            grossAmount: data[2]
          }
        })
      }
    })
  })
  app.get('/api/account/list', (req, res) => {
    let sql = `select * from my_account where login_user = "${req.user_id}" and type = "${req.query.type}"`
    if (!req.query.type) {
      sql = `select * from my_account where login_user = "${req.user_id}"`
    }
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err)
        res.json({
          status: 0,
          data: []
        })
      } else {
        res.json({
          status: 1,
          data: rows
        })
      }
    })
  })
  app.get('/api/income/list', (req, res) => {
    let sql = `select * from income where login_user = "${req.user_id}" and type = "${req.query.type}" and (date between "${ req.query.start} " and "${req.query.end}")`
    if (!req.query.type) {
      sql = `select * from income where login_user = "${req.user_id}" and type != "normal" and type != "money_management" and (date between "${ req.query.start} " and "${req.query.end}")`
    }
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err)
        res.json({
          status: 0,
          data: []
        })
      } else {
        res.json({
          status: 1,
          data: rows
        })
      }
      /* if(!req.query.type){

         })
       } else {
         db.query(`select * from income where login_user = "${req.user_id}" and type = "${req.query.type}" and date between "${ req.query.start}" and "${req.query.end}"`, (err, rows) => {
           if (err) {
             console.log(err)
             res.json({
               status: 0,
               data: []
             })
           } else {
             res.json({
               status: 1,
               data: rows
             })
           }
         })
       }*/
    })
  })
  app.get('/api/expend/list', (req, res) => {
    let sql = `select * from expend where login_user = "${req.user_id}" and type = "${req.query.type}" and (date between "${ req.query.start} " and "${req.query.end}")`
    if (!req.query.type) {
      sql = `select * from expend where login_user = "${req.user_id}" and type != "normal" and type != "money_management" and (date between "${ req.query.start} " and "${req.query.end}")`
    }
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err)
        res.json({
          status: 0,
          data: []
        })
      } else {
        res.json({
          status: 1,
          data: rows
        })
      }
    })
  })
  app.post('/api/add/account', (req, res) => {
    db.query(`insert into my_account (account_name, account_user,amount, type,login_user) values ("${req.body.accountName}", "${req.body.accountUser}","0","${req.body.type}","${req.user_id}") `, (err, rows) => {
      if (err) {
        res.json({
          status: 0
        })
      } else {
        res.json({
          status: 1
        })
      }
    })
  })
  app.post('/api/add/income', (req, res) => {
    db.query(`insert into income
    (account_id, account_name, account_user, type, login_user, amount, date, description)
    values ("${req.body.account_id}", "${req.body.account_name}", "${req.body.account_user}", "${req.body.type}", "${req.user_id}", "${req.body.amount}", "${req.body.date}", "${req.body.description}");
    update my_account set amount = amount + ("${req.body.amount}") where account_id='${req.body.account_id}'`, (err, rows) => {
      if (err) {
        console.log(err)
        res.json({
          status: 0
        })
      } else {
        res.json({
          status: 1
        })
      }
    })
  })
  app.post('/api/add/expend', (req, res) => {
    db.query(`insert into expend
    (account_id, account_name, account_user, type, login_user, amount, date, description)
    values ("${req.body.account_id}", "${req.body.account_name}", "${req.body.account_user}", "${req.body.type}", "${req.user_id}", "${req.body.amount}", "${req.body.date}", "${req.body.description}");
    update my_account set amount = amount - ("${req.body.amount}") where account_id='${req.body.account_id}'`, (err, rows) => {
      if (err) {
        console.log(err)
        res.json({
          status: 0
        })
      } else {
        res.json({
          status: 1
        })
      }
    })
  })
  app.post('/api/delete/account', (req, res) => {
    db.query(`delete from my_account where account_id in( ${req.body.account_id} )`, (err, rows) => {
      if (err) {
        res.json({
          status: 0
        })
      } else {
        res.json({
          status: 1
        })
      }
    })
  })
  app.post('/api/register', (req, res) => {
    let isRepetition = false
    db.query(`select * from user_list where user_name = "${req.body.user}"`, (err, rows) => {
      if (rows[0]) {
        res.json({
          status: 2
        })
      } else {
        db.query(`insert into user_list (user_name, password) values ("${req.body.user}", "${req.body.password}") `, (err, rows) => {
          if (err) {
            res.json({
              status: 0
            })
          } else {
            let token = jwt.sign({name: req.body.user}, app.get('superSecret'), {
              expiresIn: 3600
            });
            res.json({
              status: 1,
              token: token
            })
            db.query(`select * from user_list where user_name = "${req.body.user}"`, (err, rows) => {
              console.log(err,rows[0].user_id)
              db.query(`insert into my_account (account_name, account_user, amount, type, login_user, isDefult) values ("支付宝", "${req.body.user}","0","normal","${rows[0].user_id}", true) `, (err, rows) => {
                console.log(err)

              })
            })
          }
        })
      }
    })
  })
  app.post('/api/login', (req, res) => {
    db.query(`select * from user_list where user_name = "${req.body.user}"`, (err, rows) => {
      if (rows[0]) {
        if (req.body.password === rows[0].password) {
          let token = jwt.sign({name: rows[0].user_name}, app.get('superSecret'), {
            expiresIn: 3600
          });
          res.json({
            status: 1,
            token: token
          })
        } else {
          res.json({
            status: 2
          })
        }
      } else {
        res.json({
          status: 0
        })
      }
    })
  })

}
module.exports = appService


