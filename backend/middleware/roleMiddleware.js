const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403);
  throw new Error('Bu işlem için admin yetkisi gerekli');
};

module.exports = { adminOnly };
