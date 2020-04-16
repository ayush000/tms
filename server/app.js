"use strict";

var expressJWT = require('express-jwt');
var app = require("express")();
var swaggerTools = require("swagger-tools");
var YAML = require("yamljs");
var cors = require('cors');
var auth = require("./api/helpers/authenticate");
var swaggerConfig = YAML.load("./api/swagger/swagger.yaml");

require('dotenv').config({ path: __dirname + '/config/.env' });

var models = require('./models');
var initLogger = require('./config/logger');
const logger = initLogger.initLogger();


//database
models.sequelize.sync()
  .then(() => {
    logger.verbose(`Database & tables created!`)
  }).catch(err => {
    logger.error(err, 'something went wrong');
  });

app.options('*', cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(
  expressJWT({ secret: process.env.jwtSecret }).unless({
    path: [
      '/api/v1/login',
      '/api/v1/register'
    ]
  })
);

const overwriteLoggers = () => {
  const logLevels = ['debug', 'verbose', 'info', 'warn', 'error'];

  for (const logLevel of logLevels) {
    const log = logger[logLevel];
    logger[logLevel] = message => {
      if (typeof message === 'object') {
        log(JSON.stringify(message));
      } else {
        log(message);
      }

      return null;
    };
  }
}

// It will stringify the objects that are logged
overwriteLoggers();

swaggerTools.initializeMiddleware(swaggerConfig, function (middleware) {
  //Serves the Swagger UI on /docs
  app.use(middleware.swaggerMetadata()); // needs to go BEFORE swaggerSecurity

  app.use(
    middleware.swaggerSecurity({
      //manage token function in the 'auth' module
      Bearer: auth.verifyToken
    })
  );

  var routerConfig = {
    controllers: "./api/controllers",
    useStubs: false
  };

  app.use(middleware.swaggerRouter(routerConfig));

  app.use(middleware.swaggerUi());

  app.listen(10010, function () {
    logger.info("Started server on port 10010");
  });
});