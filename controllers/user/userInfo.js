const User = require("../../models/user");

exports.getUserInfo = (req, res, next) => {
    res.render("user/userInfo", { user: req.user, path: "/userInfo",
    isAuth:req.session.isLoggedIn });
  };
exports.postUserInfo = (req, res, next) => {
    const imageUpdate = req.file;
    const imagePath = imageUpdate.path
    console.log('img',imageUpdate)
    User.updateOne({ _id: req.user._id }, { $set: { imageUrl: imagePath } })
      .then(() => {
        console.log("USERRR", imageUpdate);
        res.redirect("back");
        res.render("user/userInfo", { user: req.user, path: "/userInfo" });
      })
      .catch((err) => console.log(err));
  };