const User = require("../../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errMess: "",
    isAuth:req.session.isLoggedIn
    
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //express-validator

  User.findOne({ email: email }).then((user) => {
    
        if (user.password === password) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            res.redirect("/");
          });
        } else {
          return res.redirect("/login");
        }
      
  }).catch(err => console.log(err))
  ;
};


exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
