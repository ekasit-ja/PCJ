/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	view: function(req, res) {
        var ps, ns;
        Project
            .find()
            .sort("position desc")
            .populate("images", {sort: "position asc"})
            .limit(3)
            .then(function(projects) {
                ps = projects;
                dynamicInter(req, "Project", ps);
                return News
                    .find()
                    .sort("position desc")
                    .limit(2)
                    .populate("images", {sort: "position asc"});
            })
            .then(function(newses) {
                dynamicInter(req, "News", newses);
                limitText(newses);
                ns = newses;

                return CarouselImage.find().sort("position asc");
            })
            .then(function(imgs) {
                return res.view("homepage", {
                    projects: ps,
                    newses: ns,
                    imgs: imgs,
                    title: "seo-home-title",
                    metaKeyword: "seo-home-meta-keyword",
                    metaDesc: "seo-home-meta-desc",
                    locale: req.getLocale(),
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });;
    },


    carouselManage: function(req, res) {
        CarouselImage
            .find()
            .sort("position asc")
            .then(function(imgs) {
                return res.view("carousel_manage", {
                    imgs: imgs,
                    follow: false,
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    apiCarouselCreate: function(req, res) {
        var params = {};
        var _fs;
        uploadFiles(req.file("images"))
            .then(function(fs) {
                if(fs.length < 1)
                    throw "No file has been uploaded."

                params.url = fs[0].extra.uploadPath;

                _fs = fs;
                return CarouselImage.create(params);
            })
            .then(function(pi) {
                return res.json({
                    files: [{
                        name: _fs[0].extra.filename,
                        size: _fs[0].size,
                        url: params.url,
                    }]
                });
            })
            .catch(function(err) {
                return res.json({
                    files: [{
                        name: _fs[0].filename,
                        size: _fs[0].size,
                        error: err,
                    }]
                });
            });
    },

    apiCarouselDelete: function(req, res) {
        var imgIds = req.param("imgIds");

        CarouselImage
            .destroy({id: imgIds})
            .then(function(imgs) {
                return res.json({
                    imgIds: imgs,
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    apiCarouselReorder: function(req, res) {
        var order = req.param("order") || [];

        var tasks = [];
        for(var i=0; i<order.length; i++) {
            if(order[i]) {
                (function(i) {
                    tasks.push(function(cb) {
                        CarouselImage
                            .update(order[i], {position: i+1})
                            .exec(cb);
                    });
                })(i);
            }
        }

        async.parallel(tasks, function(err, results) {
            if(err) return res.serverError(err);

            return res.json({
                order: order,
            });
        });
    },

    about: function(req, res) {
        return res.view("about", {
            title: "seo-about-title",
            metaKeyword: "seo-about-meta-keyword",
            metaDesc: "seo-about-meta-desc",
        });
    },

    contact: function(req, res) {
        return res.view("contact", {
            title: "seo-contact-title",
            metaKeyword: "seo-contact-meta-keyword",
            metaDesc: "seo-contact-meta-desc",
        });
    },

    careers: function(req, res) {
        return res.view("careers", {
            title: "seo-careers-title",
            metaKeyword: "seo-careers-meta-keyword",
            metaDesc: "seo-careers-meta-desc",
        });
    },

    apiSetLang: function(req, res) {
        var lang = req.param("lang") || "";

        if(sails.config.i18n.locales.includes(lang)) {
            req.session.langPref = lang;
            return res.json({
                lang: req.session.langPref,
            });
        }
        else {
            return res.json({
                lang: "en",
            });
        }
    },

    webmail: function(req, res) {
        return res.redirect(301, sails.config.appUrl.webmail);
    },

    whm: function(req, res) {
        return res.redirect(301, sails.config.appUrl.whm);
    },

    cpanel: function(req, res) {
        return res.redirect(301, sails.config.appUrl.whm);
    },
};

