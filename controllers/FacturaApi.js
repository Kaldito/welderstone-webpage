module.exports = async (req,res)=>{
    let role = "viewer";
    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
    }
    if (
        role == "admin"

    ) {

        
            //console.log(productos)
            res.render("facturaApi", {
                roles: role,
                loggedIn: true,
            });
         }else {
        res.redirect("/");
    }
}


