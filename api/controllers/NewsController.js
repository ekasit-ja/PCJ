/**
 * NewsController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	viewList: function(req, res) {
        News
            .find()
            .sort("position desc")
            .populate("images", {sort: "position asc"})
            .then(function(newses) {
                dynamicInter(req, "News", newses);
                limitText(newses);

                return res.view("news/list", {
                    newses: newses,
                    title: "seo-news-title",
                    metaKeyword: "seo-news-meta-keyword",
                    metaDesc: "seo-news-meta-desc",
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    viewDetails: function(req, res) {
        News
            .findOne({id: req.param("nid")})
            .populate("images", {sort: "position asc"})
            .then(function(news) {
                dynamicInter(req, "News", news);

                return res.view("news/details", {
                    news: news,
                    title: news.title,
                    metaKeyword: news.title,
                    metaDesc: limitText(news.content, 255),
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    manage: function(req, res) {
        News
            .find()
            .sort("position desc")
            .populate("images", {sort: "position asc"})
            .then(function(newses) {
                return res.view("news/manage", {
                    newses: newses,
                    follow: false,
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    create: function(req, res) {
        if(req.method == "POST") {
            var params = readForm(req, [
                "title",
                "title_th",
                "content",
                "content_th",
            ]);

            News
                .create(params)
                .then(function(n) {
                    return res.json({
                        news: n,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            return res.view("news/create", {
                follow: false,
            });
        }
    },

    apiImageCreate: function(req, res) {
        var params = readForm(req, [
            "news",
        ]);

        var _fs;
        uploadFiles(req.file("images"))
            .then(function(fs) {
                if(fs.length < 1)
                    throw "No file has been uploaded."

                params.url = fs[0].extra.uploadPath;

                _fs = fs;
                return NewsImage.create(params)
            })
            .then(function(ni) {
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

    update: function(req, res) {
        var nid = req.param("nid");

        if(req.method == "POST") {
            var params = readForm(req, [
                "title",
                "title_th",
                "content",
                "content_th",
            ]);
            params.id = nid;

            News
                .update({id: nid}, params)
                .then(function(n) {
                    return res.json({
                        news: n[0],
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            News
                .findOne({id: nid})
                .populate("images", {sort: "position asc"})
                .then(function(news) {
                    return res.view("news/update", {
                        news: news,
                        follow: false,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    delete: function(req, res) {
        News
            .destroy({id: req.param("nid")})
            .then(function() {
                return res.redirect(
                    sails.getUrlFor('NewsController.manage')
                );
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    apiImageDelete: function(req, res) {
        var imgIds = req.param("imgIds");

        NewsImage
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

    apiImageReorder: function(req, res) {
        var order = req.param("order") || [];

        var tasks = [];
        for(var i=0; i<order.length; i++) {
            if(order[i]) {
                (function(i) {
                    tasks.push(function(cb) {
                        NewsImage
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

    reorder: function(req, res) {
        var order = req.param("order") || [];

        var tasks = [];
        for(var i=0; i<order.length; i++) {
            if(order[i]) {
                (function(i) {
                    tasks.push(function(cb) {
                        News
                            .update(order[i], {position: order.length-i})
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
};

