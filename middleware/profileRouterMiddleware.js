const updateFields = ['email', 'fullName', 'avatar', 'status'];
class ProfileRouterMiddleware {
  updateProfile(req, res, next) {
    try {
      const requester = req.user.id;
      req.updateFields = updateFields;
      if (req.body.password && req.body.oldPassword) {
        req.updateFields.push('password');
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProfileRouterMiddleware();
