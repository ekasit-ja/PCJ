module.exports = function handleError(type, data) {
    var req = this.req;
    var res = this.res;

    switch(type) {
        case 0: {
            // DB create error
            sails.log.error(data.err.toString());
            req.flash("error", data.flash);
            return res.redirect(data.url);
        }
        case 1: {
            // DB find and update error
            sails.log.error(data.err.toString());
            req.flash("error", "An unexpected error has occurred. Please try again later.");
            return res.redirect(data.url);
        }
        case 2: {
            // DB find not found
            req.flash("error", "Request data cannot be found.");
            return res.redirect(data.url);
        }
    }
}
