const User = require("../models/User.js");

module.exports = async (req, res) => {
    var page = req.query.page;

    let role = "viewer";
    let logged = false;
    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
        logged = true;
    }

    res.render("data_form", { hide: "hidden" });
};
