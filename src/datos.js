const Material = require('../models/materiales.js');
const mongoose = require('mongoose');

const XLSX = require('xlsx');

mongoose.connect('mongodb://localhost:27017/Woolderstone', {
    useNewUrlParser: true,
});

const ExcelAJSON = () => {
    const excel = XLSX.readFile(
        'C:\\Users\\mraar\\Desktop\\weldesrtone-main\\prueba.xlsx'
    );
    const nombreHoja = excel.SheetNames;
    const datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]], {
        cellDates: true,
    });
    console.log(datos);

    Material.create(datos);
};

ExcelAJSON();
