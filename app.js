const express = require('express')
const path = require('path')
const app = express()
const session = require("express-session");



// use Bootstrap
app.use('/css', express.static(path.join( 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join( 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join( 'node_modules/jquery/dist')))
app.set('view engine','ejs')

const User = require('./models/user')


//use bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));


//use multer
const multer = require("multer")
//create file store
    const fileStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,'images')
        },
        filename:(req,file,cb) => {
            cb(null,file.originalname)
        }
    })
//create file filter
const fileFilter = (req,file,cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg'||file.mimetype === 'image/jpeg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('image'))

//set directory
app.use(express.static(path.join(__dirname,'public')))
app.use('/images', express.static(path.join(__dirname, 'images')));


//find User
app.use((req,res,next) => {
User.findById('63745ee31934dd9b76982b9c')
    .then( user => {
        req.user = user
        console.log('Find User OK!')
        console.log('appISCHECKOUT',global.isCheckout)
        next()
    })
    .catch(err => console.log(err))
})

//session
app.use(session({ secret: 'keyboard cat', resave: false,
saveUninitialized: false}))


app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        console.log(req.user._id)
        next();
      })
      .catch(err => console.log(err));
  });

//connect Route
const userRoute = require('./router/user')
const authRoute = require('./router/auth')
const adminRoute = require('./router/admin')
app.use(userRoute)
app.use(authRoute)
app.use(adminRoute)

//connect Mongodb
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin:admin1234@cluster0.bocxde9.mongodb.net/managerStaff?retryWrites=true&w=majority')
.then(() => {
    User.findOne().then(user => {
        if(!user){
            const user = new User({
                name: "Mai Mạnh Tường",
                doB: new Date("1997-04-10").toLocaleDateString(),
                salaryScale: 1,
                startDate: new Date("2022-08-17"),
                department: "IT",
                annualLeave: 3,
                imageUrl: "https://png.pngtree.com/png-vector/20191101/ourlarge/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg",
                email:'maimanhtuong@gmail.com',
                password:'tuong1234',
                isAdmin:true,
                supervise:[]
            })
            user.save()
        }

        app.listen(8000)
    })
})
.catch(err => console.log(err))