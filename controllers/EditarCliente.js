module.exports = async (req,res)=>{
    const Facturapi = require('facturapi');
//const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
const facturapi = new Facturapi('sk_live_6DmBl09j7dMbkxayWDbBla8lDDnoRrOL2qw5X4epKZ');

    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }
    const idCustomer = req.params.id
    const customer = await facturapi.customers.retrieve(idCustomer);
console.log(customer)
    res.render('EditarCliente',{roles: role, loggedIn: logged,idCustomer,customer})
}