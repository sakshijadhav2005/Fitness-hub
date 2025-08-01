const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Access Denied: Admins Only" });
    }
  };
  
  module.exports = adminMiddleware;
  