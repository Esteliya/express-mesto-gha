const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, process.env['JWT_SECRET']);
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
};
