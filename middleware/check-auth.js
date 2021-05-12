const jwt = require("jsonwebtoken");
const config = require('../config/env/development');
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, config.secret);
    req.memberData = {
      memberId: decodedToken.memberId
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: "You are not authenticated!"
    });
  }
};