
const addLoginFlag = (req, res, next) => {
    res.locals.login = req.isAuthenticated();
    next();
};


const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/login')
}

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return next();
}

module.exports = {
    checkAuthenticated: checkAuthenticated,
    checkNotAuthenticated: checkNotAuthenticated,
    addLoginFlag: addLoginFlag
}
