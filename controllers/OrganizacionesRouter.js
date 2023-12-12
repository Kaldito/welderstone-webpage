var express = require ('express');
var router =express.Router();

const Facturapi = require('facturapi');
//const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
const facturapi = new Facturapi('sk_live_6DmBl09j7dMbkxayWDbBla8lDDnoRrOL2qw5X4epKZ');

router.get('/Organizaciones',async (req,res,next)=>{
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }

try {



    res.render('Organizaciones',{roles: role, loggedIn: logged})

        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error interno del servidor');
        }
});


module.exports = router;