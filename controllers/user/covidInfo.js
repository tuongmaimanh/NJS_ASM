const covidInfo = require("../../models/covidInfo")
const CovidInfo = require("../../models/covidInfo")


exports.getCovidInfo = (req,res,next) => {
  CovidInfo.findOne({userId: req.user._id})
  .then(covidInfo => {
    if(!covidInfo){

      res.render('user/covidInfo',{covidInfo:undefined,mess:'',path:'/covidInfo'})
    }else{
      res.render('user/covidInfo',{covidInfo:covidInfo,mess:'',path:'/covidInfo'})
    }
  })
}

exports.postTemperature = (req,res,next) => {
  console.log(req.body.date)
  console.log(req.body.temp)
CovidInfo.findOne({userId: req.user._id}).then(
  covidInfo => {
    if(!covidInfo){
      const temp = new CovidInfo({
        userId: req.user._id,
        date: new Date(),
        temperature:[
          {
            date: req.body.date,
            temp: req.body.temp
          }
        ]
      })
      temp.save()
      res.render('user/covidInfo',{covidInfo:covidInfo,mess:'Temperature declared successful!',path:'/covidInfo'})

    }else{
     const temp = covidInfo.temperature
     temp.push({
      date:req.body.date,
      temp: req.body.temp
     })
     covidInfo.save()
     res.render('user/covidInfo',{covidInfo:covidInfo,mess:'Temperature declared successful!',path:'/covidInfo'})

    }
  }
)
  

}
exports.postVaccine = (req,res,next) => {
  console.log(req.body.date)
  console.log(req.body.vaccine)

  CovidInfo.findOne({userId: req.user._id}).then(covidInfo => {
    if(!covidInfo){
      const vaccine = new CovidInfo({
        userId: req.user._id,
        date: new Date(),
        vaccine:[
          {
            date: req.body.date,
            vaccine: req.body.vaccine
          }
        ]
      })
      vaccine.save()
      res.render('user/covidInfo',{covidInfo:covidInfo,mess:'Vaccine declared successful!',path:'/covidInfo'})

    }else{
      const vaccine = covidInfo.vaccine
      vaccine.push({
        date: req.body.date,
            vaccine: req.body.vaccine
      })
      covidInfo.save()
      res.render('user/covidInfo',{covidInfo:covidInfo,mess:'Vaccine declared successful!',path:'/covidInfo'})

    }
  })
  
}
exports.postInfected = (req,res,next) => {
  console.log(req.body.date)
  console.log(req.body.infected)
  console.log(req.body.note)

  CovidInfo.findOne({userId: req.user._id}).then(covidInfo => {
    if(!covidInfo){
      const infected = new CovidInfo({
        userId: req.user._id,
        date: new Date(),
        infected:[
          {
            date: req.body.date,
            methodTest: req.body.infected,
            note: req.body.note
          }
        ]
      })
      infected.save()
      res.render('user/covidInfo',{covidInfo:covidInfo,mess:'Declared successful!',path:'/covidInfo'})

    }else{
      const infected = covidInfo.infected
      infected.push({
        date: req.body.date,
            methodTest: req.body.infected,
            note: req.body.note
      })
      covidInfo.save()
      res.render('user/covidInfo',{covidInfo:covidInfo,mess:'Declared successful!',path:'/covidInfo'})

    }
  })
  
}
