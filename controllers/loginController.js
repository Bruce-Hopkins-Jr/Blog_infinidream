// Login info
const adminInfoJson = require('../config/adminInfo.json')
let adminInfo = {
    user: adminInfoJson.user,
    password: adminInfoJson.password
}

// Submits login
exports.post_login = function(req, res) {
    if(!req.body.user || !req.body.password){
        res.status("400");
        res.send("Invalid details!");
     } else if (req.body.user === adminInfo.user 
        && req.body.password === adminInfo.password){
        req.session.user = adminInfo;
        res.send("Thanks");
    } else {
        res.status("400");
        res.send("Wrong info")
    }
}

// Validates login, used for routes. If the user is not logged in it will prevent the user from proceeding
exports.validateLogin = function(req, res, next) {
    if (req.session.user) {
        if(req.session.user.user === adminInfo.user && 
            req.session.user.password === adminInfo.password) {
            return next()
    
        }
        console.error("Login failed")
        res.status(403).json({message: "You are not logged in"})
    }
    console.error("Not Logged in")
    res.status(403).json({message: "You are not logged in"})
}

// Checks if the user is logged in. It works with validasales@budgetchampteLogin. Sends a status 200 if validateLogin works.
exports.confirmLogin = function(req, res, next) {
    res.status(200)
    res.send("User is logged in")
}
