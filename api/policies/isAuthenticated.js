module.exports = function(req, res, next) {
    if(req.isAuthenticated())
        return next();
    else
        req.session.next = req.url;
        return res.redirect(sails.getUrlFor("UserController.login"));
};
