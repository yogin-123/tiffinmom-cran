/* eslint-disable no-unmodified-loop-condition */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable n/no-callback-literal */
/* eslint-disable camelcase */
const con = require('./database')
const GLOBALS = require('./constants')
const lang = require('./language')
const moment = require('moment')
const asyncLoop = require('node-async-loop')

const common = {
  async validate_token(req, res, next) {
    try {
      req.language = (req.headers['accept-language']) ? req.headers['accept-language'] : 'en'
      if (req.headers.token) {
        con.query(`SELECT user_id FROM tbl_user_device WHERE token = '${req.headers.token}' LIMIT 1`, (err, result) => {
          if (err) common.sendResponse(err, '-1', lang[req.language].text_rest_tokeninvalid, null, '401')
          if (result.length !== 0) {
            req.login_user_id = result[0].user_id
            common.decryption(req.body).then((params) => {
              req.body = params
              next()
            })
          } else {
            common.sendResponse(res, '-1', lang[req.language].text_rest_tokeninvalid, null, '401')
          }
        })
      } else {
        next()
      }
    } catch (err) {
      common.sendResponse(res, '-1', lang[req.language].text_rest_invalid_api_key, null, '401')
    }
  },

  admin_validate_token(req, res, next) {
    try {
      req.language = 'en'
      const path_data = req.path.split('/')
      const byPassMethod = new Array('signin')
      if (byPassMethod.indexOf(path_data[path_data.length - 1]) === -1) {
        if (req.headers.token) {
          con.query(`SELECT id FROM tbl_admin WHERE token = '${req.headers.token}' LIMIT 1`, (err, result) => {
            if (err) common.sendResponse(err, '-1', lang[req.language].text_rest_tokeninvalid, null, '401')
            if (result.length !== 0) {
              req.login_user_id = result[0].id
              next()
            } else {
              common.sendResponse(res, '-1', lang[req.language].text_rest_tokeninvalid, null, '401')
            }
          })
        } else {
          common.sendResponse(res, '-1', lang[req.language].text_rest_required_token, null, '401')
        }
      } else {
        next()
      }
    } catch (err) {
      common.sendResponse(res, '-1', lang[req.language].text_rest_invalid_api_key, null, '401')
    }
  },

  website_validate_token(req, res, callback) {
    try {
      req.language = 'en'
      const path_data = req.path.split('/')
      const byPassMethod = ['home_data', 'signin', 'signup', 'reset_password', 'send_otp', 'verify_otp', 'state_list', 'contact_us', 'gallery', 'product_list', 'category_list', 'faqs', 'how_it_work_page', 'tiffin_list', 'tiffin_detail', 'subscription_list']
      if (byPassMethod.indexOf(req.method === 'GET' ? path_data[1] : path_data[path_data.length - 1]) === -1) {
        if (req.headers.token) {
          con.query(`SELECT id FROM tbl_user WHERE token = '${req.headers.token}' LIMIT 1`, (err, result) => {
            if (err) common.sendResponse(res, '-1', lang[req.language].text_rest_tokeninvalid, null, '401')
            if (result.length !== 0) {
              req.login_user_id = result[0].id
              callback()
            } else {
              common.sendResponse(res, '-1', lang[req.language].text_rest_tokeninvalid, null, '401')
            }
          })
        } else {
          common.sendResponse(res, '-1', lang[req.language].text_rest_required_token, null, '401')
        }
      } else {
        callback()
      }
    } catch (err) {
      common.sendResponse(res, '-1', lang[req.language].text_rest_invalid_api_key, null, '401')
    }
  },

  checkValidation(params, rules, language = 'en') {
    const messages = {
      required: lang[language].required,
      email: lang[language].email,
      integer: lang[language].integer,
      in: lang[language].in
    }
    const v = require('Validator').make(params, rules, messages)
    if (v.fails()) {
      const errors = v.getErrors()
      return {
        status: false,
        error: Object.values(errors)[0][0]
      }
    } else {
      return {
        status: true
      }
    }
  },

  async check_unique(params, callback) {
    common.unique_fields('email', params.email).then(() => {
      callback(false)
    }).catch((err) => {
      console.log(err)
      callback(true, params.email, 'email')
    })
  },

  async unique_fields(field, value) {
    return new Promise((resolve, reject) => {
      con.query(`SELECT id FROM tbl_user WHERE ${field} = '${value}' AND is_active != 'Delete' LIMIT 1`, (err, result) => {
        if (err) console.log(err)
        if (result.length > 0) {
          reject('Already exists')
        } else {
          resolve()
        }
      })
    })
  },

  checkAdminDeviceInfo(id) {
    return new Promise((resolve, reject) => {
      const token = (new Date()).getTime() + common.stringGen(12) + common.numberGen(16)
      const device = {
        token,
        last_login_datetime: moment().format('X')
      }
      con.query(`UPDATE tbl_admin SET ? WHERE id = '${id}'`, device, (err, result) => {
        if (err) reject(err)
        if (result.affectedRows !== 0) {
          resolve(device)
        } else {
          reject()
        }
      })
    })
  },

  checkUserDeviceInfo(id) {
    return new Promise((resolve, reject) => {
      const token = (new Date()).getTime() + common.stringGen(12) + common.numberGen(16)
      const device = {
        token,
        update_datetime: moment().format('X')
      }
      con.query(`UPDATE tbl_user SET ? WHERE id = '${id}'`, device, (err, result) => {
        if (result.affectedRows !== 0) {
          if (err) reject()
          resolve(device)
        } else {
          reject()
        }
      })
    })
  },

  sendResponse: (res, resCode, resMessage, resData, resStatus = '200') => {
    const response =
    {
      code: parseInt(resCode),
      message: resMessage
    }
    if (resData != null) {
      response.data = resData
    }
    res.status(resStatus)
    res.json(response)
    res.end()
  },

  // add data to table
  add_data(table, params, callback) {
    con.query(`INSERT INTO ${table} SET ?`, params, (err) => {
      if (err) console.log(err)
      callback(true)
    })
  },

  // get count for table
  totalCount(table, cb) {
    con.query(`SELECT COUNT(id) AS total FROM ${table} WHERE is_active != 'Delete'`, (error, result) => {
      if (!error && result[0]) {
        cb(result[0].total)
      } else {
        cb(0)
      }
    })
  },

  // Update data to table
  async update_data(table, where, params) {
    con.query(`UPDATE ${table} SET ? WHERE ${where}`, params) // end select query;
  },

  // send sms
  async send_sms(phone, otp, template) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  },

  // send mail
  async send_email(subject, to_email, message, credential = { email: '', password: '' }) {
    return new Promise((resolve, reject) => {
      const nodemailer = require('nodemailer')
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: (credential.email !== '') ? credential.email : GLOBALS.EMAIL_ID, // generated ethereal user
          pass: (credential.password !== '') ? credential.password : GLOBALS.EMAIL_PASSWORD // generated ethereal password
        }
      })

      console.log((credential.email !== '') ? credential.email : GLOBALS.EMAIL_ID, (credential.password !== '') ? credential.password : GLOBALS.EMAIL_PASSWORD)

      // setup email data with unicode symbols
      const mailOptions = {
        from: GLOBALS.APP_NAME + ' <' + GLOBALS.EMAIL_ID + '>', // sender address
        to: to_email, // list of receivers
        subject, // subject line
        html: message
      }

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        console.log(error, info)
        if (error) {
          reject()
        } else {
          resolve()
        }
      })
    })
  },

  // Prepare data for push notification
  prepare_notification(user_id, push_params) {
    con.query(`SELECT u.id,d.device_token,d.device_type FROM tbl_user AS u JOIN tbl_user_device AS d ON d.user_id = u.id WHERE u.is_active != 'Delete' AND u.id = ${user_id} LIMIT 1`, (err, result) => {
      if (!err && result[0]) {
        const push_data = {
          title: push_params.title,
          body: push_params.body,
          topic: GLOBALS.BUNDLEID,
          priority: 'high',
          notification: {
            title: push_params.title,
            body: push_params.body
          },
          alert: {
            title: push_params.title,
            body: push_params.body
          },
          custom: push_params.custom
        }
        if (result[0].device_type === 'I') {
          push_data.sound = 'default'
        }
        const registrationIds = []
        registrationIds.push(result[0].device_token)
        common.send_push(registrationIds, push_data)
      }
    })
  },

  // send push
  send_push: function (registrationIds, data) {
    const settings = {
      gcm: {
        id: GLOBALS.GCM_PUSH_KEY
      },
      apn: {
        token: {
          key: GLOBALS.APN_PUSH_KEY,
          keyId: GLOBALS.KEYID,
          teamId: GLOBALS.TEAMID
        }
      },
      isAlwaysUseFCM: false
    }
    const PushNotifications = require('node-pushnotifications')
    const push = new PushNotifications(settings)
    // console.log("========================")
    // console.log(data);
    push.send(registrationIds, data, (err, result) => {
      if (err) console.log(err)
      // if (err) {
      //     console.log('error');
      //     console.log(err);
      // } else {
      //     console.log('succ');
      //     console.log(result);
      //     console.log(result[0].message);
      // }
    })
  },

  // number random generate
  numberGen(len) {
    common.timestamp = +new Date()
    const _getRandomInt = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    const ts = common.timestamp.toString()
    const parts = ts.split('').reverse()
    let id = ''
    for (let i = 0; i < len; ++i) {
      const index = _getRandomInt(0, parts.length - 1)
      parts[index] = parts[index] === '0' ? 4 : parts[index]
      id += parts[index]
    }
    return id
  },

  // string random generate
  stringGen(len) {
    const result = []
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < len; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
    }
    return result.join('')
  },

  // get all time slot a day
  get_all_time_slot(pstart_time = '00:00', pend_time = '23:00', pinterval = 60) {
    const start_time = moment(pstart_time, 'HH:mm')
    const end_time = moment(pend_time, 'HH:mm')
    const interval = pinterval
    const timeslot = []
    while (start_time <= end_time) {
      timeslot.push(moment(start_time).format('HH:mm:ss'))
      start_time.add(interval, 'minutes')
    }
    return timeslot
  },

  // get all date slot between start & end date
  get_all_month_date_slot(start_date, end_date) {
    const monthslot = []
    const date = new Date(start_date)
    const end = new Date(end_date)
    while (date <= end) {
      monthslot.push(moment(date).format('YYYY-MM-DD'))
      date.setDate(date.getDate() + 1)
    }
    return monthslot
  },

  async get_old_image_name_and_delete(table, field, where, dirname, callback) {
    con.query(`SELECT ${field} AS image FROM ${table} WHERE ${where}`, (err, result) => {
      if (!err && result[0] !== undefined) {
        if (result[0].image) {
          this.deleteSingleFileS3(dirname, result[0].image)
          callback()
        } else {
          callback()
        }
      } else {
        callback()
      }
    })
  },

  // Function to delete single image from the s3 bucket
  async deleteSingleFileS3(dirName, fileName) {
    if (fileName === 'default-user.png') {
      // callback(1);
      return
    }
    const AWS = require('aws-sdk')
    const s3 = new AWS.S3({
      accessKeyId: GLOBALS.S3_ACCESS_KEY,
      secretAccessKey: GLOBALS.S3_SECRET_KEY,
      region: GLOBALS.S3_REGION
    })

    const params = {
      Bucket: GLOBALS.S3_BUCKET_NAME, // pass your bucket name
      Key: dirName + fileName // file will be saved as user/xyz.png
    }

    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err, err.stack) // error
        // callback("0");
      } else {
        // callback("1");
      }
    })
  },

  // Function to delete multiple image from the s3 bucket
  deleteMultipleFileS3: function (dirName, filesName, keyname, callback) {
    const AWS = require('aws-sdk')
    const s3 = new AWS.S3({
      accessKeyId: GLOBALS.S3_ACCESS_KEY,
      secretAccessKey: GLOBALS.S3_SECRET_KEY,
      region: GLOBALS.S3_REGION
    })

    const deleteObjects = []
    asyncLoop(filesName, function (item, next) {
      if (item.image === 'default.png') {
        next()
      } else {
        deleteObjects.push({ Key: dirName + item.image }) // file will be saved as user/xyz.png
        next()
      }
    }, function () {
      const options = {
        Bucket: GLOBALS.BUCKET_NAME, // pass your bucket names
        Delete: {
          Objects: deleteObjects
        }
      }
      s3.deleteObjects(options, function (err, data) {
        if (err) {
          callback('0')
        } else {
          callback('1')
        }
      })
    })
  }
}
module.exports = common
