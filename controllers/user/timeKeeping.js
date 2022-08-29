const TimeKeeping = require("../../models/timeKeeping");
const User = require("../../models/user");
const Leave = require("../../models/leave");

exports.getIndex = (req, res, next) => {
    res.render("user/index", { mess:undefined,path: "/" });
  };
  exports.getCheckIn = (req, res, next) => {
    res.render("user/checkIn", { mess: undefined,name:req.user.name, path: "/checkIn" });

    
  };

  exports.postCheckIn = (req,res,next) =>{
    //create new time keeping in day or new shift work
    if (global.isCheckout || global.isCheckout == undefined) {
      //Check user had check time in day?
      TimeKeeping.find({
        userId: req.user._id,
        date: new Date().toLocaleDateString(),
      })
        .then((timeKeepingInday) => {
          console.log("aaaaa", timeKeepingInday);
          //if true mean user had checked time in day and now create new shift work
          if (timeKeepingInday.length > 0) {
            console.log("tim thay");
            const newShift = {
              checkIn: new Date(),
              checkOut: new Date(0),
              workplace: "Company",
            };
  
            const detail = timeKeepingInday[0].detail;
            detail.push(newShift);
            timeKeepingInday[0].save();
          } else {
            //if false mean user had no checked in day and now create new detail(timeKeepingInDay)
            console.log("ko tim thay");
            const date = new Date();
            const timeKeeping = new TimeKeeping({
              userId: req.user._id,
              date: new Date().toLocaleDateString(),
              detail: [
                {
                  checkIn: date,
                  checkOut: new Date(date),
                  workplace: req.body.workplace,
                },
              ],
            });
            timeKeeping.save();
          }
        })
        .catch((err) => console.log(err));
  
        res.render("user/checkIn", { mess: `You are check in at: ${new Date().toLocaleTimeString()}`,name:req.user.name,isWorking: true, path: "/checkIn" });
      global.isCheckout = false;

    } else {
      res.render("user/checkIn", { mess: "Please Check Out",name:req.user.name, path: "/checkIn" });
    }
  }

  // exports.getCheckOut = (req, res, next) => {

  // }
  exports.getCheckOut = (req, res, next) => {
    console.log("isCHECKOUT", global.isCheckout);
  
    if (global.isCheckout == false) {
      TimeKeeping.findOne({
        userId: req.user._id,
        date: new Date().toLocaleDateString(),
      })
        .then((timeKeepingInday) => {
          //set isCheckout return 'true'
          global.isCheckout = true;
          console.log(timeKeepingInday);
          //get the last check time in day of index
          const nowShiftIndex = timeKeepingInday.detail.length - 1;
          //get the last check time in day
          const nowShift = timeKeepingInday.detail[nowShiftIndex];
          nowShift.checkOut = new Date();
  
          timeKeepingInday.save();
  
          
          res.render("user/checkOut", { mess: `You Check Out Successful at: ${new Date().toLocaleTimeString()}`,name:req.user.name, path: "/checkOut" });
        })
        .catch((err) => console.log(err));
    } else {
      res.render("user/checkOut", { mess: "Please Check In",name:req.user.name, path: "/checkOut" });
    }
  };
  exports.getLeave = (req, res, next) => {
    const annualLeave = req.user.annualLeave;
  
    //lay phan du cua anualleave va hien thi cung voi phan nguyen
    const day = Math.floor(annualLeave);
    const hours = (annualLeave - day) * 8;
  
    if (annualLeave == 0) {
      res.render("user/leave", {
        mess: "Your annual leave is 0, so you can not take a leave",
        canTakeLeave: false,
        path: "/",
      });
    } else {
      res.render("user/leave", {
        mess: `Your annual leave is: ${day} day and ${hours} hours (${annualLeave} day)`,
        canTakeLeave: true,
        path: "/",
      });
    }
  };
  exports.postLeave = (req, res, next) => {
    //get day leave from body and caculate to number
  
    let fromLeave = new Date(req.body.from_leave);
    const toLeave = new Date(req.body.to_leave);
    const hourLeave = parseInt(req.body.hours) / 8;
    const totalTakeLeave =
      (toLeave - fromLeave) / 60 / 60 / 24 / 1000 + hourLeave;
  
    const annualLeave = req.user.annualLeave;
  
    //lay phan du cua anualleave va hien thi cung voi phan nguyen
    const day = Math.floor(totalTakeLeave);
    const hours = (totalTakeLeave - day) * 8;
  
    //check day leave is smaller annualLeave
    if (totalTakeLeave <= req.user.annualLeave) {
      //get all day user will leave
      const dayLeave = [];
      dayLeave.push(fromLeave);
      while (fromLeave.getTime() < toLeave.getTime()) {
        //push into dayLeave
        var middleDayLeave = new Date(fromLeave.getTime() + 86400000);
        dayLeave.push(middleDayLeave);
        fromLeave = middleDayLeave;
      }
      //get hour leave and day
      const hourLeave = {
        date: new Date(req.body.day_leave_hours).toLocaleDateString(),
        hours: req.body.hours,
      };
  
      //create new leave record--
      const leaveOfUser = new Leave({
        userId: req.user._id,
        dayLeave: dayLeave,
        hourLeave: hourLeave,
        reason: req.body.reason,
      });
      leaveOfUser.save();
  
      //update annualLeave in user record--
      const annualLeaveUpdate = annualLeave - totalTakeLeave;
      User.updateOne(
        { _id: req.user._id },
        { $set: { annualLeave: annualLeaveUpdate } }
      )
        .then(() => {
          res.render("user/leave", {
            mess: `You take a leave successfully. You will leave in ${day} day and ${hours} hours (${totalTakeLeave} day). If you want change your leave please contact to your admin!`,
            canTakeLeave: false,
            path: "/",
          });
        })
        .catch((err) => console.log(err));
    } else {
      res.render("user/leave", {
        mess: "Your take leave need smaller or equal with your annual leave",
        canTakeLeave: true,
        path: "/",
      });
    }
  };
  