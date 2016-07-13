/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	fireSteelDoor: function(req, res) {
        res.view("product/fire_steel_door");
    },

    ductDamper: function(req, res) {
        res.view("product/duct_damper");
    },

    manage: function(req, res) {
        Product.find().exec(function(err, products) {
            if(err) console.log(err);
            else {
                return res.view("product/manage", {
                    products: products,
                });
            }
        });
    },

    create: function(req, res) {
        if(req.method == "POST") {
            var uploadFile = req.file("image");

            uploadFile.upload({dirname: sails.imageDirectoryFromTmp}, function(err, files) {
                if(err) console.log("error!");
                else {
                    var filename = files[0].fd.split('\\').reverse()[0];
                    var params = readForm(req, [
                        "category",
                        "type",
                        "model",
                        "title",
                    ]);
                    params.image = sails.imageDirectory + filename;
                    console.log(params);

                    Product.create(params).exec(function(err, p) {
                        if(err)
                            console.log(err);
                        else
                            return res.redirect(sails.getUrlFor('ProductController.manage'));
                    });
                }
            });

        }
        else {
            res.view("product/create");
        }
    },
};

