const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
const token = req.cookies.jwt;
let payload;

  next();
}

module.exports = {
  auth,
};
