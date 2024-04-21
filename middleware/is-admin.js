module.exports = (req, res, next) => {
    if (!req || !req.cookie || !req.cookie.user || req.cookie.isAdmin !== 'alimagdi12367@gmail.com') {
        return res.redirect('/login');
    }
    next();
}
