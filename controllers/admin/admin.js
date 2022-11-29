const CovidInfo = require("../../models/covidInfo")
exports.getCovidInfoStaff=(req,res,next)=>{
   const idStaff = req.params.id
   console.log('ID',idStaff)
    CovidInfo.findOne({userId:idStaff}).then(covidInfoStaff=>{
        console.log(covidInfoStaff)
        res.render("user/covidInfoStaff",{
            covidInfo: covidInfoStaff, 
            path: "/covidInfoStaff",
        isAuth: req.session.isLoggedIn,

        })
    })
}