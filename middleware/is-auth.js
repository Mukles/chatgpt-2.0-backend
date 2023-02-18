const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null)
    return res.status(401).json({ message: "Authorization header not found" });

  jwt.verify(token, accesTokenSecret, (err, user) => {
    if (err) return res.status(403).json({ message: err });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
