const TimeKeeping = require("../../models/timeKeeping");
const User = require("../../models/user");
const Leave = require("../../models/leave");

const ITEMS_PER_PAGE = 1;

exports.getSearching = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  var dayLeaveWithHour = {};
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  //find day leave
  console.log(req.user.id);
  Leave.findOne({
    userId: req.user._id,
    date: { $gte: firstDay, $lte: lastDay },
  })
    .then((leave) => {
      console.log("leaveeee", leave);
      if (leave.hourLeave.hours > 0) {
        //leave day and hours
        dayLeaveWithHour.date = leave.hourLeave.date;
        dayLeaveWithHour.hours = leave.hourLeave.hours;
      }

      //find Time keeping and render
      TimeKeeping.find({ userId: req.user._id })
        .countDocuments()
        .then((numLeave) => {
          totalItems = numLeave;
          return TimeKeeping.find({ userId: req.user._id })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
        })
        .then((timeKeeping) => {
          res.render("user/searching", {
            timeKeeping: timeKeeping,
            dayLeaveWithHour: dayLeaveWithHour,
            leave: leave,
            name: req.user.name,
            salaryScale: undefined,
            overTime: undefined,
            lostTime: undefined,
            salary: undefined,
            path: "/searching",
            isAuth: req.session.isLoggedIn,

            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postFindSalary = (req, res, next) => {
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  Leave.findOne({
    userId: req.user._id,
    date: { $gte: firstDay, $lte: lastDay },
  })
    .exec()
    .then((leave) => {
      var dayLeaveWithHour = {};
      if (leave.hourLeave.hours > 0) {
        //leave day and hours
        dayLeaveWithHour = {
          date: leave.hourLeave.date,
          hours: leave.hourLeave.hours,
        };
      }
      console.log("L:", dayLeaveWithHour);

      ///////////////////////
      var date = new Date(req.body.month);
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      TimeKeeping.find({ userId: req.user._id })
        .then((timeKeeping) => {
          TimeKeeping.find({
            userId: req.user._id,
            date: { $gte: firstDay, $lte: lastDay },
          })
            .then((timeKeepingInMonth) => {
              var totalWorkInMonth = 0;
              var totalOverTimeInMonth = 0;
              var totalLostInMonth = 0;

              console.log("timeMonth", timeKeepingInMonth);
              for (let inDay of timeKeepingInMonth) {
                var totalWorkInDay = 0;
                var totalOverTimeInDay = 0;
                var totalLostInDay = 0;
                var timeWorkInShift = 0;
                for (let shift of inDay.detail) {
                  //get checkIn -checkOut
                  timeWorkInShift +=
                    shift.checkOut.getHours() +
                    shift.checkOut.getMinutes() / 60 -
                    (shift.checkIn.getHours() +
                      shift.checkIn.getMinutes() / 60);
                }
                //get hours leave
                if (
                  Object.keys(dayLeaveWithHour).length !== 0 &&
                  dayLeaveWithHour.date.getTime() === inDay.date.getTime() &&
                  dayLeaveWithHour.hours > 0
                ) {
                  //leave not empty and day leave == day and hours > 0
                  timeWorkInShift += dayLeaveWithHour.hours;
                  console.log("t", timeWorkInShift);
                }

                //now we have time work in a day and separate become totalWorkInDay totalOT and totalLost
                if (timeWorkInShift >= 8) {
                  totalWorkInDay += 8;
                  totalOverTimeInDay += timeWorkInShift - 8;
                  totalLostInDay += 0;
                } else {
                  totalWorkInDay += timeWorkInShift;
                  totalOverTimeInDay += 0;
                  totalLostInDay += 8 - timeWorkInShift;
                }

                console.log("ttLINDAY:", totalLostInDay);
                console.log("ttWINDAY:", totalWorkInDay);
                console.log("overDAY:", totalOverTimeInDay);
                totalWorkInMonth += totalWorkInDay;
                // totalWorkInMonth = totalWorkInMonth;
                totalOverTimeInMonth += totalOverTimeInDay;
                // totalOverTimeInMonth = totalOverTimeInDay.toFixed(1);

                totalLostInMonth += totalLostInDay;
                // totalLostInMonth = totalLostInDay.toFixed(1);
              }
              console.log(
                "ttMonth:",
                totalWorkInMonth,
                totalLostInMonth,
                totalOverTimeInMonth
              );
              const salary = (
                req.user.salaryScale * 3000000 +
                (totalOverTimeInMonth - totalLostInMonth) * 200000
              ).toLocaleString("en-US");
              console.log(
                req.user.salaryScale,
                totalOverTimeInMonth,
                totalLostInMonth
              );
              console.log("salary", salary);
              res.render("user/searching", {
                timeKeeping: timeKeeping,
                dayLeaveWithHour: dayLeaveWithHour,
                leave: leave,
                name: req.user.name,
                salaryScale: req.user.salaryScale,
                overTime: totalOverTimeInMonth,
                lostTime: totalLostInMonth,
                salary: salary,
                path: "/searching",
                isAuth: req.session.isLoggedIn,
                currentPage: 1,
                nextPage:2,
                previousPage:0,
                lastPage:2,
                hasNextPage: true,
            hasPreviousPage: true,
              });
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
