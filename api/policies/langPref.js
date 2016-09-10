module.exports = function(req, res, next) {
    var sub = req.subdomains;
    for(var i=0; i<sub.length; i++)
        if(sub[i] == "mail")
            return res.redirect(sails.config.appUrl.webmail);

    if(req.session.langPref)
        req.setLocale(req.session.langPref);
    else
        req.setLocale(sails.config.i18n.defaultLocale);

    return next();
};
