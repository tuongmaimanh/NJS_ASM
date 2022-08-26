const User = require("../../models/user");

exports.getUserInfo = (req, res, next) => {
    res.render("user/userInfo", { user: req.user, path: "/userInfo" });
  };
exports.postUserInfo = (req, res, next) => {
    const imageUrlUpdate = req.body.imageUrl;
    User.updateOne({ _id: req.user._id }, { $set: { imageUrl: imageUrlUpdate } })
      .then(() => {
        console.log("USERRR", req.user.imageUrl);
        res.redirect("back");
        res.render("user/userInfo", { user: req.user, path: "/userInfo" });
      })
      .catch((err) => console.log(err));
  };