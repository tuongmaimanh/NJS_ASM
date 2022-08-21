const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')


router.get('/',userController.getIndex)
router.get('/checkIn',userController.getCheckIn)
router.get('/checkOut',userController.getCheckOut)
router.get('/leave',userController.getLeave)

router.post('/leave',userController.postLeave)

router.get('/userInfo',userController.getUserInfo)
router.post('/userInfo',userController.postUserInfo)

router.get('/searching',userController.getSearching)

module.exports = router