module.exports = function(req, res, next) {
    if(req.session.langPref)
        req.setLocale(req.session.langPref);
    else
        req.setLocale(sails.config.i18n.defaultLocale);

    return next();
};
