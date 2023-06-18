module.exports = (req, res) => {
    let hidden = "hidden";
    if (req.params.status == "false") {
        hidden = "";
    }

    if (req.isAuthenticated()) {
        res.redirect("/");
    } else {
        res.render("login", { hide: hidden });
    }
};
