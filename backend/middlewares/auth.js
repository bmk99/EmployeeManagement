const jwt = require("jsonwebtoken");

const authorization = async (req, res, next) => {
  try {
    const header = req.header("Authorization");

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization Failed" });
    }
    const accesToken = header.split(" ");
    const token = accesToken[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.username = decoded.username;
    req.userid = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};

module.exports = authorization;
