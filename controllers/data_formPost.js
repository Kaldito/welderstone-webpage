const User = require("../models/User.js");

module.exports = async (req, res) => {
    const fullName = req.body.FullName;
    console.log(fullName)
    const Tel = req.body.Tel;
    const user_id = req.session.passport.user.id;

    await User.findByIdAndUpdate(user_id, {fullName: fullName, tel: Tel});

    res.redirect("/");
};
