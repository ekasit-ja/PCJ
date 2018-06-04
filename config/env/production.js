/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

var MySQLSessionStore = require('express-mysql-session');
var winston = require('winston');

var db_options = {
    adapter: 'sails-mysql',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Admin1234',
    database: 'pcj_industries'
}

module.exports = {

    /***************************************************************************
     * Set the default database connection for models in the production        *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    ssl: {
      ca: require('fs').readFileSync('/etc/letsencrypt/live/server.pcjindustries.co.th/chain.pem', 'utf8').toString(),
      key: require('fs').readFileSync('/etc/letsencrypt/live/server.pcjindustries.co.th/privkey.pem', 'utf8').toString(),
      cert: require('fs').readFileSync('/etc/letsencrypt/live/server.pcjindustries.co.th/cert.pem', 'utf8').toString()
    }

    connections: {
        mysqlDb: db_options,
    },

    models: {
      connection: "mysqlDb",
      migrate: "safe",
    },

    session: {
        store: new MySQLSessionStore(db_options),
    },

    hookTimeout: 240000,

    log: {
        colors: false,
        custom: new winston.Logger({
            transports: [
                new(winston.transports.File)({
                    level: "warn",
                    filename: "logs/sails-prod.log"
                }),
            ],
        }),
    },

    /***************************************************************************
     * Set the port in the production environment to 80                        *
     ***************************************************************************/

    port: 80,

    /***************************************************************************
     * Set the log level in production environment to "silent"                 *
     ***************************************************************************/

    // log: {
    //   level: "silent"
    // }

};
