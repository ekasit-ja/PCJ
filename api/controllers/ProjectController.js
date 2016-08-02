/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var pageLimit = 30;

module.exports = {
    view: function(req, res) {
        var params = {};
        var country = req.param("country");
        var year = req.param("year");
        var page = req.param("page");

        if(country)
            params["country"] = country;

        if(year)
            params["year"] = year;

        if(!Number.isInteger(parseInt(page)))
            page = 1;

        var countryObj = {};
        var yearObj = {};
        var countrySet = [];
        var yearSet = [];
        var count;
        Project
            .find()
            .sort("country asc")
            .then(function(projects) {
                for(var i=0; i<projects.length; i++)
                    countryObj[projects[i].country] = 1;

                for(var key in countryObj)
                    countrySet.push(key);

                return Project.find().sort("year desc")
            })
            .then(function(projects) {
                for(var i=0; i<projects.length; i++)
                    yearObj[projects[i].year] = 1;

                for(var key in yearObj)
                    yearSet.push(key);

                return Project
                    .find(params)
                    .sort("position desc")
                    .populate("images", {sort: "position asc"});
            })
            .then(function(projects) {
                count = Math.ceil(projects.length/pageLimit) || 0;

                return Project
                    .find(params)
                    .paginate({page: page, limit: pageLimit})
                    .sort("position desc")
                    .populate("images", {sort: "position asc"});
            })
            .then(function(projects) {
                dynamicInter(req, "Project", projects);
                return res.view("project/view", {
                    projects: projects,
                    country: country,
                    year: year,
                    countrySet: countrySet,
                    yearSet: yearSet,
                    count: count,
                    page: page,
                    title: "seo-project-title",
                    metaKeyword: "seo-project-meta-keyword",
                    metaDesc: "seo-project-meta-desc",
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    apiGetProject: function(req, res) {
        var pid = req.param("pid");
        if(isNaN(pid))
            mid = -1;

        Project
            .findOne(pid)
            .populate("images", {sort: "position asc"})
            .exec(function(err, project) {
                if(err) return res.serverError(err);

                dynamicInter(req, "Project", project);
                return res.json(project);
            });
    },

    manage: function(req, res) {
        Project
            .find()
            .sort("position desc")
            .populate("images", {sort: "position asc"})
            .then(function(projects) {
                return res.view("project/manage", {
                    projects: projects,
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
                "desc",
                "desc_th",
                "country",
                "region",
                "year",
                "company",
            ]);

            Project
                .create(params)
                .then(function(p) {
                    return res.json({
                        project: p,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            return res.view("project/create");
        }
    },

    apiImageCreate: function(req, res) {
        var params = readForm(req, [
            "project",
        ]);

        var _fs;
        uploadFiles(req.file("images"))
            .then(function(fs) {
                if(fs.length < 1)
                    throw "No file has been uploaded."

                params.url = fs[0].extra.uploadPath;

                _fs = fs;
                return ProjectImage.create(params)
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

    update: function(req, res) {
        var pid = req.param("pid");

        if(req.method == "POST") {
            var params = readForm(req, [
                "title",
                "title_th",
                "desc",
                "desc_th",
                "country",
                "region",
                "year",
                "company",
            ]);
            params.id = pid;

            Project
                .update({id: pid}, params)
                .then(function(p) {
                    return res.json({
                        project: p[0],
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Project
                .findOne({id: pid})
                .populate("images", {sort: "position asc"})
                .then(function(project) {
                    return res.view("project/update", {
                        project: project,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    delete: function(req, res) {
        Project
            .destroy({id: req.param("pid")})
            .then(function() {
                return res.redirect(
                    sails.getUrlFor('ProjectController.manage')
                );
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    apiImageDelete: function(req, res) {
        var imgIds = req.param("imgIds");

        ProjectImage
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
                        ProjectImage
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
                        Project
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

