module.exports = async (req,res)=>{
    
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }
    const idCustomer = req.params.id
    res.render('EditarCliente',{roles: role, loggedIn: logged,idCustomer})
}