const jwt = require('jsonwebtoken');

// секретный ключ в отдельной env переменной
const { JWT_SECRET = 'super-strong-secret' } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
};
