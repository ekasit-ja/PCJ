module.exports = function(req, res, next) {
    if(req.session.langPref)
        req.setLocale(req.session.langPref);

    return next();
};
