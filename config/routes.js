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
    "/": "HomeController.view",

    "get /login": "UserController.login",
    "post /login": "AuthController.login",
    "/logout": "AuthController.logout",
    "/register": "UserController.register",

    "/webmail": "HomeController.webmail",
    "/product/fire-steel-door": "ProductController.fsd",
    "/product/fire-steel-door/m_:mid": "ProductController.fsdModel",
    "/product/fire-damper": "ProductController.fd",
    "/product/fire-damper/m_:mid": "ProductController.fdModel",
    "/product/duct-damper": "ProductController.dd",
    "/product/duct-damper/m_:mid": "ProductController.ddModel",
    "/product/air-outlet": "ProductController.ao",
    "/product/air-outlet/m_:mid": "ProductController.aoModel",
    "/product/duct-silencer": "ProductController.ds",
    "/product/duct-silencer/m_:mid": "ProductController.dsModel",
    "/project": "ProjectController.view",
    "/api/project/read/:pid": "ProjectController.apiGetProject",
    "/about": "HomeController.about",
    "/contact": "HomeController.contact",
    "/careers": "HomeController.careers",
    "/lang": "HomeController.apiSetLang",

    "/news": "NewsController.viewList",
    "/news/details/:nid": "NewsController.viewDetails",
    "/news/manage": "NewsController.manage",
    "/news/create": "NewsController.create",
    "/news/update/:nid": "NewsController.update",
    "/news/delete": "NewsController.delete",
    "/api/news/reorder": "NewsController.reorder",
    "/api/news/image/create": "NewsController.apiImageCreate",
    "/api/news/image/delete": "NewsController.apiImageDelete",
    "/api/news/image/reorder": "NewsController.apiImageReorder",





    "/admin": "AdminController.dashboard",
    "/password/update": "UserController.passwordUpdate",

    "/type/manage": "TypeController.manage",
    "/type/create": "TypeController.create",
    "/type/update/:tid": "TypeController.update",
    "/type/delete": "TypeController.delete",
    "/api/type/reorder": "TypeController.reorder",

    "/model/manage": "ModelController.manage",
    "/model/create": "ModelController.create",
    "/model/update/:mid": "ModelController.update",
    "/model/delete": "ModelController.delete",
    "/api/model/reorder": "ModelController.reorder",

    "/product/manage": "ProductController.manage",
    "/product/create": "ProductController.create",
    "/product/update/:pid": "ProductController.update",
    "/product/delete": "ProductController.delete",
    "/api/product/reorder": "ProductController.reorder",

    "/hardware/manage": "HardwareController.manage",
    "/hardware/create": "HardwareController.create",
    "/hardware/update/:hid": "HardwareController.update",
    "/hardware/delete": "HardwareController.delete",
    "/api/hardware/reorder": "HardwareController.reorder",

    "/file/manage": "FileController.manage",
    "/file/create": "FileController.create",
    "/file/update/:fid": "FileController.update",
    "/file/delete": "FileController.delete",
    "/api/file/reorder": "FileController.reorder",

    "/project/manage": "ProjectController.manage",
    "/project/create": "ProjectController.create",
    "/project/update/:pid": "ProjectController.update",
    "/project/delete": "ProjectController.delete",
    "/api/project/image/create": "ProjectController.apiImageCreate",
    "/api/project/image/delete": "ProjectController.apiImageDelete",
    "/api/project/image/reorder": "ProjectController.apiImageReorder",
    "/api/project/reorder": "ProjectController.reorder",

    "/carousel/manage": "HomeController.carouselManage",
    "/api/carousel/create": "HomeController.apiCarouselCreate",
    "/api/carousel/delete": "HomeController.apiCarouselDelete",
    "/api/carousel/reorder": "HomeController.apiCarouselReorder",
};
