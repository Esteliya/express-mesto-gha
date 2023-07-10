const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    //next(err);
    res.status(401).send({ message: err.message });
  }
  req.user = payload;
  next();
}

module.exports = {
  auth,
};
