const { ObjectId } = require("mongodb");
const CovidInfo = require("../../models/covidInfo");

exports.getCovidInfo = async (req, res, next) => {
  CovidInfo.findOne({ userId: req.user._id }).then((covidInfo) => {
    if (!covidInfo) {
      res.render("user/covidInfo", {
        covidInfo: undefined,
        covidInfoStaff: [],
        mess: "",
        path: "/covidInfo",
        isAuth: req.session.isLoggedIn,
      });
    } else {
      
        console.log('+++',req.user.supervise)
        const covidInfoStaff = req.user.supervise
        res.render("user/covidInfo", {
          covidInfo: covidInfo,
          covidInfoStaff: covidInfoStaff,
          mess: "",
          path: "/covidInfo",
          isAuth: req.session.isLoggedIn,
        });
      
    }
  });
};

exports.postTemperature = (req, res, next) => {
  console.log(req.body.date);
  console.log(req.body.temp);
  CovidInfo.findOne({ userId: req.user._id }).then((covidInfo) => {
    if (!covidInfo) {
      const temp = new CovidInfo({
        userId: req.user._id,
        date: new Date(),
        temperature: [
          {
            date: req.body.date,
            temp: req.body.temp,
          },
        ],
      });
      temp.save();
      res.render("user/covidInfo", {
        covidInfo: covidInfo,
        mess: "Temperature declared successful!",
        path: "/covidInfo",
        isAuth: req.session.isLoggedIn,
        covidInfoStaff: [],
      });
    } else {
      const temp = covidInfo.temperature;
      temp.push({
        date: req.body.date,
        temp: req.body.temp,
      });
      covidInfo.save();
      res.render("user/covidInfo", {
        covidInfo: covidInfo,
        mess: "Temperature declared successful!",
        path: "/covidInfo",
        isAuth: req.session.isLoggedIn,
        covidInfoStaff: [],
      });
    }
  });
};
exports.postVaccine = (req, res, next) => {
  console.log(req.body.date);
  console.log(req.body.vaccine);

  CovidInfo.findOne({ userId: req.user._id }).then((covidInfo) => {
    if (!covidInfo) {
      const vaccine = new CovidInfo({
        userId: req.user._id,
        date: new Date(),
        vaccine: [
          {
            date: req.body.date,
            vaccine: req.body.vaccine,
          },
        ],
      });
      vaccine.save();
      res.render("user/covidInfo", {
        covidInfo: covidInfo,
        mess: "Vaccine declared successful!",
        path: "/covidInfo",
        isAuth: req.session.isLoggedIn,
        covidInfoStaff: [],
      });
    } else {
      const vaccine = covidInfo.vaccine;
      vaccine.push({
        date: req.body.date,
        vaccine: req.body.vaccine,
      });
      covidInfo.save();
      res.render("user/covidInfo", {
        covidInfo: covidInfo,
        mess: "Vaccine declared successful!",
        path: "/covidInfo",
        isAuth: req.session.isLoggedIn,
        covidInfoStaff: [],
      });
    }
  });
};
exports.postInfected = (req, res, next) => {
  console.log(req.body.date);
  console.log(req.body.infected);
  console.log(req.body.note);

  CovidInfo.findOne({ userId: req.user._id }).then((covidInfo) => {
    if (!covidInfo) {
      const infected = new CovidInfo({
        userId: req.user._id,
        date: new Date(),
        infected: [
          {
            date: req.body.date,
            methodTest: req.body.infected,
            note: req.body.note,
          },
        ],
      });
      infected.save();
      res.render("user/covidInfo", {
        covidInfo: covidInfo,
        mess: "Declared successful!",
        path: "/covidInfo",
        isAuth: req.session.isLoggedIn,
        covidInfoStaff: [],
      });
    } else {
      const infected = covidInfo.infected;
      infected.push({
        date: req.body.date,
        methodTest: req.body.infected,
        note: req.body.note,
      });
      covidInfo.save();
      res.render("user/covidInfo", {
        covidInfo: covidInfo,
        mess: "Declared successful!",
        path: "/covidInfo",
        isAuth: req.session.isLoggedIn,
        covidInfoStaff: [],
      });
    }
  });
};
