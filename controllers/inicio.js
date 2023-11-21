const CarruselImagenes = require('../models/CarruselImagenes');
const User = require('../models/User');

module.exports = async (req, res) => {
    let role = 'viewer';
    let logged = false;
    if (req.session?.passport?.user != undefined) {
        const USER_ID = req.session?.passport?.user.id;

        const user = await User.findOne({ _id: USER_ID });

        role = req.session.passport.user.role;
        logged = true;

        if (user && user.fullName && user.fullName.length > 0) {
            const Carrusel = await CarruselImagenes.find({carrusel:"aaron"})
            res.render('inicio', { roles: role, loggedIn: logged,Carrusel });
        } else {
            res.redirect('/data-form');
        }
    } else {
        const Carrusel = await CarruselImagenes.find({carrusel:"aaron"})
        res.render('inicio', { roles: role, loggedIn: logged,Carrusel });
    }
};
