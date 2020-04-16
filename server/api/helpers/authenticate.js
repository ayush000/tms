const jwt = require('jsonwebtoken');
const logger = require('winston');
const crypto = require('crypto');

const generateToken = (claim) => {
  const token = jwt.sign(claim, process.env.jwtSecret, {
    // this is default algorithm
    algorithm: 'HS256',
    expiresIn: process.env.jwtSessionTimeOut,
    issuer: 'tms_toptal',
  });
  logger.info('Created JWT token.');

  return token;
}

const verifyToken = (request, authOrSecDef, token, next) => {
  const currentScopes = request.swagger.operation["x-user-scopes"];
  function sendError() {
    return request.res.status(403).json({ message: "Error: Access Denied" });
  }

  if (token && token.indexOf('Bearer') === 0) {
    var tokenString = token.split(" ")[1];

    jwt.verify(tokenString, process.env.jwtSecret, function (
      verificationError,
      decodedToken
    ) {
      //check if the JWT was verified correctly
      if (
        verificationError == null &&
        Array.isArray(currentScopes) &&
        decodedToken &&
        decodedToken.role
      ) {

        var roleMatch = currentScopes.indexOf(decodedToken.role) !== -1;

        if (roleMatch) {
          request.auth = decodedToken;
          return next(null);
        } else {
          return next(sendError());
        }
      } else {
        return next(sendError());
      }
    });
  } else {
    return next(sendError());
  }
};


const encrypt = password => {
  var cipher = crypto.createCipher(process.env.passwordHashAlgorithm, process.env.passwordSalt)
  var crypted = cipher.update(password, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

const decrypt = password => {
  var decipher = crypto.createDecipher(process.env.passwordHashAlgorithm, process.env.passwordSalt)
  var dec = decipher.update(password, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}

const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  BASIC: 'BASIC',
};

module.exports = {
  generateToken,
  verifyToken,
  encrypt,
  decrypt,
  ROLES
}