module.exports = (req,res,next) => {
    console.log('isloggedIn',req.session.isLoggedIn)
    if(!req.session.isLoggedIn){
        res.redirect('/login')
    }
    next()
}