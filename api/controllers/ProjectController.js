/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    view: function(req, res) {
        Project
            .find()
            .sort("position asc")
            .exec(function(err, projects) {
                if(err) return res.serverError(err);

                return res.view("project/view", {
                    projects: projects,
                });
            });
    },

    apiGetProject: function(req, res) {
        var pid = req.param("pid");
        Project
            .findOne(pid)
            .exec(function(err, project) {
                if(err) return res.serverError(err);

                return res.json(project);
            });
    },

    manage: function(req, res) {
        Project
            .find()
            .sort("position asc")
            .exec(function(err, projects) {
                if(err) return res.serverError(err);

                return res.view("project/manage", {
                    projects: projects,
                });
            });
    },

    create: function(req, res) {
        if(req.method == "POST") {
            var url;
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    // if(fs.length < 1)
                    //     throw "No file has been uploaded."

                    // url = fs[0].extra.uploadFilepath;
                    return Project.find().max("position");
                })
                .then(function(p) {
                    var params = readForm(req, [
                        "title",
                        "desc",
                    ]);
                    // params.image = [url];
                    params.position = p[0] ? p[0].position + 1 : 1;

                    return Project.create(params);
                })
                .then(function(p) {
                    // return res.redirect(
                    //     sails.getUrlFor('ProjectController.manage')
                    // );
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
        uploadSingleFile(req.file("images"))
            .then(function(fs) {
                if(fs.length < 1)
                    throw "No file has been uploaded."

                url = fs[0].extra.uploadFilepath;

                ProjectImage
                    .find()
                    .max("position")
                    .then(function(pi) {
                        var params = readForm(req, [
                            "project",
                        ]);
                        params.position = pi[0] ? pi[0].position + 1 : 1;
                        params.url = url;

                        return ProjectImage.create(params);
                    })
                    .then(function(pi) {
                        return res.json({
                            files: [{
                                name: fs[0].extra.filename,
                                size: fs[0].size,
                                url: url,
                            }]
                        });
                    })
                    .catch(function(err) {
                        throw err;
                    })
            })
            .catch(function(err) {
                return res.json({
                    files: [{
                        name: fs[0].filename,
                        size: fs[0].size,
                        error: err,
                    }]
                });
            });
    },

    update: function(req, res) {
        var pid = req.param("pid");

        if(req.method == "POST") {
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    var params = readForm(req, [
                        "title",
                        "desc",
                    ]);

                    if(fs.length > 0)
                        params.image = [fs[0].extra.uploadFilepath];

                    return Project.update({id: pid}, params);
                })
                .then(function(t) {
                    return res.redirect(
                        sails.getUrlFor('ProjectController.manage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Project.findOne({id: pid}).exec(function(err, project) {
                if(err) res.serverError(err);

                return res.view("project/update", {
                    project: project,
                });
            })
        }
    },

    delete: function(req, res) {
        Project
            .destroy({id: req.param("pid")})
            .exec(function(err) {
                if(err) return res.serverError(err);

                return res.redirect(
                    sails.getUrlFor('ProjectController.manage')
                );
            });
    },
};

