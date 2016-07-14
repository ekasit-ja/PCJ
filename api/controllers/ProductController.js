/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	fireSteelDoor: function(req, res) {
        var ms;
        Model
            .find({type: 1})
            .sort("position")
            .then(function(models) {
                ms = models
                return Product.find({model: models[0].id})
            })
            .then(function(products) {
                return res.view("product/fire_steel_door", {
                    models: ms,
                    products: products,
                });
            })
            .catch(function(err) {
                res.serverError(err);
            });
    },

    ductDamper: function(req, res) {
        res.view("product/duct_damper");
    },

    apiGetProduct: function(req, res) {

        Product
            .find({model: req.param("mid")})
            .sort("position asc")
            .exec(function(err, products) {
                if(err) return res.json(err);

                return res.json(products);
            });
    },

    manager: function(req, res) {
        return res.view("product/manager");
    },

    manage: function(req, res) {
        Product
            .find()
            .populate("model")
            .sort("position asc")
            .exec(function(err, products) {
                if(err) return res.serverError(err);

                return res.view("product/manage", {
                    products: products,
                });
            });
    },

    create: function(req, res) {
        if(req.method == "POST") {
            var url;
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    if(fs.length < 1)
                        throw "No file has been uploaded."

                    url = fs[0].extra.uploadFilepath;
                    return Product.find().max("position");
                })
                .then(function(p) {
                    var params = readForm(req, [
                        "model",
                        "title",
                    ]);
                    params.image = url;
                    params.position = p[0] ? p[0].position + 1 : 1;
                    return Product.create(params);
                })
                .then(function(p) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.manage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Model.find().exec(function(err, models) {
                if(err) return res.serverError(err);

                return res.view("product/create", {
                    models: models,
                });
            });
        }
    },

    update: function(req, res) {
        var pid = req.param("pid");

        if(req.method == "POST") {
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    var params = readForm(req, [
                        "model",
                        "title",
                    ]);

                    if(fs.length > 0)
                        params.image = fs[0].extra.uploadFilepath;

                    return Product.update({id: pid}, params);
                })
                .then(function(p) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.manage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            var ms;
            Model
                .find()
                .sort("position asc")
                .then(function(models) {
                    ms = models;
                    return Product.findOne({id: pid})
                })
                .then(function(product) {
                    return res.view("product/update", {
                        models: ms,
                        product: product,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    delete: function(req, res) {
        Product
            .destroy({id: req.param("pid")})
            .exec(function(err) {
                if(err) return res.serverError(err);

                return res.redirect(
                    sails.getUrlFor('ProductController.manage')
                );
            });
    },



    categoryManage: function(req, res) {
        Category
            .find()
            .sort("position asc")
            .exec(function(err, categories) {
                if(err) return res.serverError(err);

                return res.view("product/category/manage", {
                    categories: categories,
                });
            });
    },

    categoryCreate: function(req, res) {
        if(req.method == "POST") {
            var url;
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    if(fs.length < 1)
                        throw "No file has been uploaded."

                    url = fs[0].extra.uploadFilepath;
                    return Category.find().max("position");
                })
                .then(function(c) {
                    var params = readForm(req, [
                        "title",
                    ]);
                    params.image = url;
                    params.position = c[0] ? c[0].position + 1 : 1;
                    return Category.create(params);
                })
                .then(function(c) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.categoryManage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            return res.view("product/category/create");
        }
    },

    categoryUpdate: function(req, res) {
        var cid = req.param("cid");

        if(req.method == "POST") {
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    var params = readForm(req, [
                        "title",
                    ]);

                    if(fs.length > 0)
                        params.image = fs[0].extra.uploadFilepath;

                    return Category.update({id: cid}, params);
                })
                .then(function(c) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.categoryManage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Category
                .findOne({id: cid})
                .exec(function(err, category) {
                    if(err) return res.serverError(err);

                    return res.view("product/category/update", {
                        category: category
                    });
                });
        }
    },

    categoryDelete: function(req, res) {
        Category
            .destroy({id: req.param("cid")})
            .exec(function(err) {
                if(err) return res.serverError(err);

                return res.redirect(
                    sails.getUrlFor('ProductController.categoryManage')
                );
            });
    },



    typeManage: function(req, res) {
        Type
            .find()
            .populate("category")
            .sort("position asc")
            .exec(function(err, types) {
                if(err) return res.serverError(err);

                return res.view("product/type/manage", {
                    types: types,
                });
            });
    },

    typeCreate: function(req, res) {
        if(req.method == "POST") {
            var url;
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    if(fs.length < 1)
                        throw "No file has been uploaded."

                    url = fs[0].extra.uploadFilepath;
                    return Type.find().max("position");
                })
                .then(function(t) {
                    var params = readForm(req, [
                        "category",
                        "title",
                    ]);
                    params.image = url;
                    params.position = t[0] ? t[0].position + 1 : 1;
                    return Type.create(params);
                })
                .then(function(t) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.typeManage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Category
                .find()
                .sort("position asc")
                .exec(function(err, categories) {
                    if(err) return res.serverError(err);

                    return res.view("product/type/create", {
                        categories: categories,
                    });
                });
        }
    },

    typeUpdate: function(req, res) {
        var tid = req.param("tid");

        if(req.method == "POST") {
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    var params = readForm(req, [
                        "category",
                        "title",
                    ]);

                    if(fs.length > 0)
                        params.image = fs[0].extra.uploadFilepath;

                    return Type.update({id: tid}, params);
                })
                .then(function(t) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.typeManage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            var cs;
            Category
                .find()
                .sort("position asc")
                .then(function(categories) {
                    cs = categories;
                    return Type.findOne({id: tid})
                })
                .then(function(type) {
                    return res.view("product/type/update", {
                        categories: cs,
                        type: type,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    typeDelete: function(req, res) {
        Type
            .destroy({id: req.param("tid")})
            .exec(function(err) {
                if(err) return res.serverError(err);

                return res.redirect(
                    sails.getUrlFor('ProductController.typeManage')
                );
            });
    },



    modelManage: function(req, res) {
        Model
            .find()
            .populate("type")
            .sort("position asc")
            .exec(function(err, models) {
                if(err) return res.serverError(err);

                return res.view("product/model/manage", {
                    models: models,
                });
            });
    },

    modelCreate: function(req, res) {
        if(req.method == "POST") {
            var url;
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    if(fs.length < 1)
                        throw "No file has been uploaded."

                    url = fs[0].extra.uploadFilepath;
                    return Type.find().max("position");
                })
                .then(function(t) {
                    var params = readForm(req, [
                        "type",
                        "title",
                    ]);
                    params.image = url;
                    params.position = t[0] ? t[0].position + 1 : 1;
                    return Model.create(params);
                })
                .then(function(t) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.modelManage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Type
                .find()
                .exec(function(err, types) {
                    if(err) res.serverError(err);

                    return res.view("product/model/create", {
                        types: types,
                    });
                })
        }
    },

    modelUpdate: function(req, res) {
        var mid = req.param("mid");

        if(req.method == "POST") {
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    var params = readForm(req, [
                        "type",
                        "title",
                    ]);

                    if(fs.length > 0)
                        params.image = fs[0].extra.uploadFilepath;

                    return Model.update({id: mid}, params);
                })
                .then(function(t) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.modelManage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            var ts;
            Type
                .find()
                .sort("position asc")
                .then(function(types) {
                    ts = types;
                    return Model.findOne({id: mid})
                })
                .then(function(model) {
                    return res.view("product/model/update", {
                        types: ts,
                        model: model,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    modelDelete: function(req, res) {
        Model
            .destroy({id: req.param("mid")})
            .exec(function(err) {
                if(err) return res.serverError(err);

                return res.redirect(
                    sails.getUrlFor('ProductController.modelManage')
                );
            });
    },
};

