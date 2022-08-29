const express = require('express')
const router = express.Router()
const covidInfoController = require('../controllers/user/covidInfo')
const timeKeepingController = require('../controllers/user/timeKeeping')
const userInfoController = require('../controllers/user/userInfo')
const searchingController = require('../controllers/user/searching')


router.get('/',timeKeepingController.getIndex)
router.get('/checkIn',timeKeepingController.getCheckIn)
router.post('/checkIn',timeKeepingController.postCheckIn)
router.get('/checkOut',timeKeepingController.getCheckOut)
router.get('/leave',timeKeepingController.getLeave)

router.post('/leave',timeKeepingController.postLeave)

router.get('/userInfo',userInfoController.getUserInfo)
router.post('/userInfo',userInfoController.postUserInfo)

router.get('/searching',searchingController.getSearching)
router.post('/find-salary',searchingController.postFindSalary)

router.get('/covidInfo',covidInfoController.getCovidInfo)
router.post('/temperature',covidInfoController.postTemperature)
router.post('/vaccine',covidInfoController.postVaccine)
router.post('/infected',covidInfoController.postInfected)


module.exports = router