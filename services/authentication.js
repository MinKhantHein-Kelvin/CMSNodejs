const jwt = require ("jsonwebtoken");

module.exports = (req,res,next)=>{
  const token = req.header("access-token");
  if(!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN);
    res.locals = verified;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid Token" });
  }
}