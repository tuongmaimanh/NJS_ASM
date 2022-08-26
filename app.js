const express = require('express')
const path = require('path')
const app = express()


// use Bootstrap
app.use('/css', express.static(path.join( 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join( 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join( 'node_modules/jquery/dist')))
app.set('view engine','ejs')

const User = require('./models/user')




//use bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//find User
app.use((req,res,next) => {
User.findById('62ff48c2e6e0df7052ae570b')
    .then( user => {
        req.user = user
        console.log('Find User OK!')
        console.log('appISCHECKOUT',global.isCheckout)
        next()
    })
    .catch(err => console.log(err))
})

//connect Route
const userRoute = require('./router/user')
app.use(userRoute)

//connect Mongodb
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin:admin1234@cluster0.bocxde9.mongodb.net/managerStaff?retryWrites=true&w=majority')
.then(() => {
    User.findOne().then(user => {
        console.log(user)
        if(!user){
            const user = new User({
                name: "Mai Mạnh Tường",
                doB: new Date("1997-04-10").toLocaleDateString(),
                salaryScale: 1,
                startDate: new Date("2022-08-17"),
                department: "IT",
                annualLeave: 3,
                imageUrl: "https://png.pngtree.com/png-vector/20191101/ourlarge/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
            })
            user.save()
        }
        app.listen(8000)
    })
})
.catch(err => console.log(err))