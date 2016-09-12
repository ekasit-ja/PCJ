module.exports = function(req, res, next) {
    var sub = req.subdomains;
    for(var i=0; i<sub.length; i++)
        if(sub[i].toLowerCase() == "mail" || sub[i].toLowerCase() == "webmail")
            return res.redirect(sails.config.appUrl.webmail);

    return next();
};
