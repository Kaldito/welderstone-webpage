module.exports = (req, res) =>{
    req.logout(function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect("/");
        }
    }); 
}
    