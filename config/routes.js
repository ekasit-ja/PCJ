/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  "/": "ProductController.homepage",

  "get /login/": "UserController.login",
  "post /login/": "AuthController.login",
  "/logout/": "AuthController.logout",
  "/register/": "UserController.register",

  "/product/fireSteelDoor/": "ProductController.fsd",
  "/product/fireSteelDoor/m_:mid/": "ProductController.fsdModel",
  "/product/ductDamper/": "ProductController.dd",
  "/product/ductDamper/m_:mid/": "ProductController.ddModel",

  "/project/": "ProjectController.view",
  "/project/manage/": "ProjectController.manage",
  "/project/create/": "ProjectController.create",
  "/project/update/:pid/": "ProjectController.update",
  "/project/delete/": "ProjectController.delete",
  "/api/project/read/:pid/": "ProjectController.apiGetProject",

  "/api/project/image/create/": "ProjectController.apiImageCreate",

  "/api/product/model/:mid/": "ProductController.apiGetProduct",


  "/admin/": "AdminController.dashboard",

  "/product/manage/": "ProductController.manage",
  "/product/create/": "ProductController.create",
  "/product/update/:pid/": "ProductController.update",
  "/product/delete/": "ProductController.delete",

  "/product/type/manage/": "ProductController.typeManage",
  "/product/type/create/": "ProductController.typeCreate",
  "/product/type/update/:tid/": "ProductController.typeUpdate",
  "/product/type/delete/": "ProductController.typeDelete",

  "/product/model/manage/": "ProductController.modelManage",
  "/product/model/create/": "ProductController.modelCreate",
  "/product/model/update/:mid/": "ProductController.modelUpdate",
  "/product/model/delete/": "ProductController.modelDelete",

  "/product/hardware/manage/": "ProductController.hardwareManage",
  "/product/hardware/create/": "ProductController.hardwareCreate",
  "/product/hardware/update/:hid/": "ProductController.hardwareUpdate",
  "/product/hardware/delete/": "ProductController.hardwareDelete",
};
