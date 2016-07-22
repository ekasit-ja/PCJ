/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	manage: function(req, res) {
        File
            .find()
            .sort("position asc")
            .then(function(files) {
                return res.view("file/manage", {
                    files: files,
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    create: function(req, res) {
        if(req.method == "POST") {
            var params = readForm(req, [
                "category",
                "fileType",
                "title",
                "desc",
            ]);

            async.map(["file", "image"], function(file, cb) {
                return uploadFiles(req.file(file))
                    .then(function(fs) {
                        return cb(null, fs);
                    })
                    .catch(function(err) {
                        return cb(err, null);
                    });
            }, function(err, files) {
                if(err) return res.serverError(err);

                if(files[0].length > 0)
                    params.url = files[0][0].extra.uploadPath;

                if(files[1].length > 0)
                    params.image = files[1][0].extra.uploadPath;

                File
                    .create(params)
                    .then(function(f) {
                        return res.redirect(sails.getUrlFor("FileController.manage"));
                    })
                    .catch(function(err) {
                        return res.serverError(err);
                    });
            });
        }
        else {
            return res.view("file/create");
        }
    },

    update: function(req, res) {
        var fid = req.param("fid");

        if(req.method == "POST") {
            var params = readForm(req, [
                        "category",
                        "fileType",
                        "title",
                        "desc",
                    ]);
            params.id = fid;

            async.map(["file", "image"], function(file, cb) {
                return uploadFiles(req.file(file))
                    .then(function(fs) {
                        return cb(null, fs);
                    })
                    .catch(function(err) {
                        return cb(err, null);
                    });
            }, function(err, files) {
                if(err) return res.serverError(err);

                if(files[0].length > 0)
                    params.url = files[0][0].extra.uploadPath;

                if(files[1].length > 0)
                    params.image = files[1][0].extra.uploadPath;

                File
                    .update({id: fid}, params)
                    .then(function(fs) {
                        return res.redirect(sails.getUrlFor("FileController.manage"));
                    })
                    .catch(function(err) {
                        return res.serverError(err);
                    });
            });
        }
        else {
            File
                .findOne({id: fid})
                .then(function(file) {
                    return res.view("file/update", {
                        file: file,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    delete: function(req, res) {
        File
            .destroy({id: req.param("fid")})
            .then(function() {
                return res.redirect(
                    sails.getUrlFor("FileController.manage")
                );
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },
};

