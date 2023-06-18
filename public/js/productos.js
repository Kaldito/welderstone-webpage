// ---------- DOM MANIPULATION ---------- // 
const buttons = document.getElementsByClassName("edit");
const precioMaterialesSpan = document.querySelector("#precio-materiales");
const materialesInputs = document.querySelectorAll(".material-input");
const pinturaInputs = document.querySelectorAll(".pintura-input");
const instalacionInputs = document.querySelectorAll(".instalacion-input");
const precioPinturaSpan = document.querySelector("#precio-pintura");
const precioInstalacionSpan = document.querySelector("#precio-instalacion");
const subtotalHTML = document.querySelector("#subtotal");
const calculateSub = document.querySelector("#calculate-subtotal");
const materialPorcentajes = document.querySelectorAll(".material-porcentaje");
const pinturaPorcentajes = document.querySelectorAll(".pintura-porcentaje");
const instalacionPorcentajes = document.querySelectorAll(".instalacion-porcentaje");
const plusOneBtn = document.querySelector("#plus-one");
const minusOneBtn = document.querySelector("#minus-one");
const especsDiv = document.querySelector("#especificaciones");
// - Modals
const materialBusqueda = document.querySelector("#mm-busqueda");
const pinturaBusqueda = document.querySelector("#mp-busqueda");
const instalacionBusqueda = document.querySelector("#mi-busqueda");

const instalacionFiltro = document.querySelector("#instalacion-filtro");
const pinturaFiltro = document.querySelector("#pintura-filtro");
const materialesFiltro = document.querySelector("#materiales-filtro");

const modalMateriales = document.querySelectorAll(".modal-materiales");
const modalMaterialesFamilias = document.querySelectorAll(".modal-materiales-familias");
const modalMaterialesSubfamilias = document.querySelectorAll(".modal-materiales-subfamilias");

const modalPinturas = document.querySelectorAll(".modal-pintura");
const modalPinturaFamilias = document.querySelectorAll(".modal-pintura-familias");
const modalPinturaSubfamilias = document.querySelectorAll(".modal-pintura-subfamilias");

const modalInstalacion = document.querySelectorAll(".modal-instalacion");
const modalInstalacionFamilias = document.querySelectorAll(".modal-instalacion-familias");
const modalInstalacionSubfamilias = document.querySelectorAll(".modal-instalacion-subfamilias");



// ---------- GLOBAL CONST AND VARIABLES ---------- // 
const materialesUsados = {};
const pinturaUsada = {};
const instalacionUsada = {};

let especs = 1;

// ---------- FUNCTIONS ---------- // 
function setUp(inputs, objetoMateriales, objective){
    inputs.forEach(inp => {
        inp.addEventListener("input", function(){
            if(inp.value != ""){
                let inp_number = parseFloat(inp.value);
    
                if(inp_number >= 0){
                    objetoMateriales[inp.id][1] = inp_number;
    
                    priceArray(objetoMateriales, objective);
                }
            } else {
                objetoMateriales[inp.id][1] = 0;
    
                priceArray(objetoMateriales, objective);
            }
        })
    });
}

function priceArray(arr, objective){
    let precio = 0;

    const keys = Object.keys(arr);
    if(keys.length > 0){
        keys.forEach(key => {
            precio += (arr[key][0] * arr[key][1]);

            let fprecio = precio.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
            objective.innerHTML = fprecio;
        });
    } else {
        let fprecio = precio.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        objective.innerHTML = fprecio;
    }
}

function calculatePrice(objetoMateriales, objective){
    for (const material in objetoMateriales) {
        const inp = objetoMateriales[material][2];
        if(inp.value != ""){
            let inp_number = parseFloat(inp.value);

            if(inp_number >= 0){
                objetoMateriales[inp.id][1] = inp_number;

                priceArray(objetoMateriales, objective);
            }
        } else {
            objetoMateriales[inp.id][1] = 0;

            priceArray(objetoMateriales, objective);
        }
    }
}

function filtrar(barraBusqueda, filterArray, filter){
    const texto = barraBusqueda.value.toLowerCase();

    for(let material of filterArray){
        if(filter == "Descripcion"){
            let nombre = material.id.toLowerCase();

            if(nombre.indexOf(texto) != -1){
                material.classList.remove("hide");
            }  else {
                material.classList.add("hide");
            }
        } else {
            let nombre = material.value.toLowerCase();

            const parent = material.parentNode;

            if(nombre.indexOf(texto) != -1){
                parent.classList.remove("hide");
            }  else {
                parent.classList.add("hide");
            }
        }
    }
}

// ---------- MAIN ---------- // 
for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    const btn_id = btn.id;
    btn.addEventListener("click", function(){
        const relatedBtns = document.querySelectorAll(".agregar-" + btn_id)
        let h_div = document.querySelector("." + btn_id);
        let hidden = h_div.hidden;
        let inputs = h_div.getElementsByTagName('input');

        if (hidden) {
            for (let i = 0; i < relatedBtns.length; i++) {
                const rBtn = relatedBtns[i];

                rBtn.innerHTML = "Quitar";
                rBtn.classList.remove("btn-danger");
                rBtn.classList.add("btn-dark");
            }

            for(var i = 0; i < inputs.length; i++) {
                const inp = inputs[i];
                inp.removeAttribute("disabled");
            }

            h_div.removeAttribute("hidden");

            inputs[0].value = 1;
            console.log(btn_id[0]);
            switch(btn_id[0]){
                case "M":
                    const mat = h_div.querySelector(".material-input");

                    Object.defineProperty(materialesUsados, btn_id, {
                        value: [parseFloat(btn.value), 0, mat],
                        configurable: true,
                        enumerable: true,
                        writable: true
                    });

                    calculatePrice(materialesUsados, precioMaterialesSpan);

                    break;

                case "P":
                    const pint = h_div.querySelector(".pintura-input");

                    Object.defineProperty(pinturaUsada, btn_id, {
                        value: [parseFloat(btn.value), 0, pint],
                        configurable: true,
                        enumerable: true,
                        writable: true
                    });

                    calculatePrice(pinturaUsada, precioPinturaSpan);

                    break;

                case "I":
                    const inst = h_div.querySelector(".instalacion-input");

                    Object.defineProperty(instalacionUsada, btn_id, {
                        value: [parseFloat(btn.value), 0, inst],
                        configurable: true,
                        enumerable: true,
                        writable: true
                    });

                    calculatePrice(instalacionUsada, precioInstalacionSpan);

                    break;
            };
        } else {
            for (let i = 0; i < relatedBtns.length; i++) {
                const rBtn = relatedBtns[i];

                rBtn.innerHTML = "Agregar";
                rBtn.classList.remove("btn-dark");
                rBtn.classList.add("btn-danger");

                switch(btn_id[0]){
                    case "M":
                        delete materialesUsados[btn_id];
                        priceArray(materialesUsados, precioMaterialesSpan);
    
                        break;
    
                    case "P":
                        delete pinturaUsada[btn_id];
                        priceArray(pinturaUsada, precioPinturaSpan);
    
                        break;
    
                    case "I":
                        delete instalacionUsada[btn_id];
                        priceArray(instalacionUsada, precioInstalacionSpan);
    
                        break;
                };
            }

            inputs[0].value = 0

            for(var i = 0; i < inputs.length; i++) {
                const inp = inputs[i];
                inp.setAttribute("disabled", "disabled");
            }

            h_div.setAttribute("hidden", "hidden");
         }
    })
};

setUp(materialesInputs, materialesUsados, precioMaterialesSpan);
setUp(pinturaInputs, pinturaUsada, precioPinturaSpan);
setUp(instalacionInputs, instalacionUsada, precioInstalacionSpan);

calculateSub.addEventListener("click", function(){
    let materiales_price = parseFloat(precioMaterialesSpan.innerHTML.replaceAll(",", ''));
    let pintura_price = parseFloat(precioPinturaSpan.innerHTML.replaceAll(",", ''));
    let instalacion_price = parseFloat(precioInstalacionSpan.innerHTML.replaceAll(",", ''));

    let subtotal = materiales_price + pintura_price + instalacion_price;

    materialPorcentajes.forEach(porcentaje => {
        subtotal += materiales_price * (parseFloat(porcentaje.value) / 100);
    });

    pinturaPorcentajes.forEach(porcentaje => {
        subtotal += pintura_price * (parseFloat(porcentaje.value) / 100);
    });

    instalacionPorcentajes.forEach(porcentaje => {
        subtotal += instalacion_price * (parseFloat(porcentaje.value) / 100);
    });

    subtotalHTML.innerHTML = `<h5 class="mb-3 resaltar-rojo">SubTotal: $${subtotal.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}  mxn</h5>`;
})

plusOneBtn.addEventListener("click", function(){
    especs++;

    const div = document.createElement("div");
    div.classList.add("input-group");
    div.classList.add("mb-2"); 
    div.id = `especificaciones-${especs}`;
    div.innerHTML = `<span class="input-group-text">${especs}</span> <input type="text" name="especificacionesNombre" autocomplete="off" autocapitalize="on" aria-label="nombre-espec" class="form-control espec${especs}" placeholder="Nombre"> <input type="text" name="especificacionesDesc" autocomplete="off" autocapitalize="on" aria-label="descripcion-espec" class="form-control espec${especs}" placeholder="Descripcion"></input>`

    especsDiv.appendChild(div);
})

minusOneBtn.addEventListener("click", function(){
    const lastEspec = document.querySelector(`#especificaciones-${especs}`);
    if(especs != 1){
        especs--;
        lastEspec.remove();
    }
})

materialBusqueda.addEventListener("input", function(){
    if(materialesFiltro.value == "Descripcion"){
        filtrar(materialBusqueda, modalMateriales, materialesFiltro.value);
    } else if(materialesFiltro.value == "Familia"){
        filtrar(materialBusqueda, modalMaterialesFamilias, materialesFiltro.value);
    } else {
        filtrar(materialBusqueda, modalMaterialesSubfamilias, materialesFiltro.value);
    }
});

pinturaBusqueda.addEventListener("input", function(){
    if(pinturaFiltro.value == "Descripcion"){
        filtrar(pinturaBusqueda, modalPinturas, pinturaFiltro.value);
    } else if(pinturaFiltro.value == "Familia"){
        filtrar(pinturaBusqueda, modalPinturaFamilias, pinturaFiltro.value);
    } else {
        filtrar(pinturaBusqueda, modalPinturaSubfamilias, pinturaFiltro.value);
    }
})

instalacionBusqueda.addEventListener("input", function(){
    if(instalacionFiltro.value == "Descripcion"){
        filtrar(instalacionBusqueda, modalInstalacion, instalacionFiltro.value);
    } else if(instalacionFiltro.value == "Familia"){
        filtrar(instalacionBusqueda, modalInstalacionFamilias, instalacionFiltro.value);
    } else {
        filtrar(instalacionBusqueda, modalInstalacionSubfamilias, instalacionFiltro.value);
    }
})

materialesFiltro.addEventListener("change", function(){
    if(materialesFiltro.value == "Descripcion"){
        filtrar(materialBusqueda, modalMateriales, materialesFiltro.value);
    } else if(materialesFiltro.value == "Familia"){
        filtrar(materialBusqueda, modalMaterialesFamilias, materialesFiltro.value);
    } else {
        filtrar(materialBusqueda, modalMaterialesSubfamilias, materialesFiltro.value);
    }
})

pinturaFiltro.addEventListener("change", function(){
    if(pinturaFiltro.value == "Descripcion"){
        filtrar(pinturaBusqueda, modalPinturas, pinturaFiltro.value);
    } else if(pinturaFiltro.value == "Familia"){
        filtrar(pinturaBusqueda, modalPinturaFamilias, pinturaFiltro.value);
    } else {
        filtrar(pinturaBusqueda, modalPinturaSubfamilias, pinturaFiltro.value);
    }
})

instalacionFiltro.addEventListener("change", function(){
    if(instalacionFiltro.value == "Descripcion"){
        filtrar(instalacionBusqueda, modalInstalacion, instalacionFiltro.value);
    } else if(instalacionFiltro.value == "Familia"){
        filtrar(instalacionBusqueda, modalInstalacionFamilias, instalacionFiltro.value);
    } else {
        filtrar(instalacionBusqueda, modalInstalacionSubfamilias, instalacionFiltro.value);
    }
})
