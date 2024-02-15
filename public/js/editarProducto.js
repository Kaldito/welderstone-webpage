// ---------- DOM MANIPULATION ---------- //
const buttons = document.getElementsByClassName('edit');
const divs = document.querySelectorAll('.editDiv');
const materialesInputs = document.querySelectorAll('.material-input');

const precioMaterialesSpan = document.querySelector('#precio-materiales');

const subtotalHTML = document.querySelector('#subtotal');
const calculateSub = document.querySelector('#calculate-subtotal');
const materialPorcentajes = document.querySelectorAll('.material-porcentaje');

const plusOneBtn = document.querySelector('#plus-one');
    const minusOneBtn = document.querySelector('#minus-one');
    const especsDiv = document.querySelector('#especificaciones');

const cap = parseFloat(document.querySelector('#cap').innerHTML);
let especs = document.querySelectorAll('#especificaciones .input-group').length || 0;
const hiddenInputsContainer = document.querySelector('#hiddenInputsPlaceholder');

// - Modals
const materialBusqueda = document.querySelector('#mm-busqueda');


const modalMateriales = document.querySelectorAll('.modal-materiales');

// ---------- GLOBAL CONST AND VARIABLES ---------- //
const materialesUsados = {};





// ---------- FUNCTIONS ---------- //
function setUp(inputs, objetoMateriales, objective) {
    inputs.forEach((inp) => {
        inp.addEventListener('input', function () {
            if (inp.value != '') {
                const inp_number = parseFloat(inp.value);

                if (inp_number >= 0) {
                    objetoMateriales[inp.id][1] = inp_number;

                    priceArray(objetoMateriales, objective);
                }
            } else {
                objetoMateriales[inp.id][1] = 0;

                priceArray(objetoMateriales, objective);
            }
        });
    });
}

function priceArray(arr, objective) {
    let precio = 0;

    const keys = Object.keys(arr);
    if (keys.length > 0) {
        keys.forEach((key) => {
            precio += arr[key][0] * arr[key][1];

            const fprecio = precio
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            objective.innerHTML = fprecio;
        });
    } else {
        const fprecio = precio
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        objective.innerHTML = fprecio;
    }
}

function calculatePrice(objetoMateriales, objective) {
    for (const material in objetoMateriales) {
        const inp = objetoMateriales[material][2];
        if (inp.value != '') {
            const inp_number = parseFloat(inp.value);

            if (inp_number >= 0) {
                objetoMateriales[inp.id][1] = inp_number;

                priceArray(objetoMateriales, objective);
            }
        } else {
            objetoMateriales[inp.id][1] = 0;

            priceArray(objetoMateriales, objective);
        }
    }
}

function filtrar(barraBusqueda, matArray) {
    const texto = barraBusqueda.value.toLowerCase();

    for (const material of matArray) {
        const nombre = material.id.toLowerCase();
        if (nombre.indexOf(texto) != -1) {
            material.classList.remove('hide');
        } else {
            material.classList.add('hide');
        }
    }
}

// ---------- MAIN ---------- //
for (let i = 0; i < divs.length; i++) {
    const ediv = divs[i];
    const hidden = ediv.hidden;
    const inputs = ediv.getElementsByTagName('input');
    const btn = ediv.querySelector('.edit');
    const btn_id = btn.id;
    const relatedBtns = document.querySelectorAll('.agregar-' + btn_id);

    if (hidden) {
        for (let i = 0; i < relatedBtns.length; i++) {
            const rBtn = relatedBtns[i];

            rBtn.innerHTML = 'Quitar';
            rBtn.classList.remove('btn-danger');
            rBtn.classList.add('btn-dark');
        }

        for (let i = 0; i < inputs.length; i++) {
            const inp = inputs[i];
            inp.removeAttribute('disabled');
        }

        ediv.removeAttribute('hidden');

        switch (btn_id[0]) {
            case 'M':
                const mat = ediv.querySelector('.material-input');

                Object.defineProperty(materialesUsados, btn_id, {
                    value: [parseFloat(btn.value), 0, mat],
                    configurable: true,
                    enumerable: true,
                    writable: true,
                });

                calculatePrice(materialesUsados, precioMaterialesSpan, false);

                break;

        }
    }
}

for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    const btn_id = btn.id;
    btn.addEventListener('click', function () {
        const relatedBtns = document.querySelectorAll('.agregar-' + btn_id);
        const h_div = document.querySelector('.' + btn_id);
        const hidden = h_div.hidden;
        const inputs = h_div.getElementsByTagName('input');

        if (hidden) {
            for (let i = 0; i < relatedBtns.length; i++) {
                const rBtn = relatedBtns[i];

                rBtn.innerHTML = 'Quitar';
                rBtn.classList.remove('btn-danger');
                rBtn.classList.add('btn-dark');
            }

            for (var i = 0; i < inputs.length; i++) {
                const inp = inputs[i];
                inp.removeAttribute('disabled');
            }

            h_div.removeAttribute('hidden');

            inputs[0].value = 1;
            // console.log(btn_id[0]);
            switch (btn_id[0]) {
                case 'M':
                    const mat = h_div.querySelector('.material-input');

                    Object.defineProperty(materialesUsados, btn_id, {
                        value: [parseFloat(btn.value), 0, mat],
                        configurable: true,
                        enumerable: true,
                        writable: true,
                    });

                    calculatePrice(materialesUsados, precioMaterialesSpan);

                    break;

            }
        } else {
            for (let i = 0; i < relatedBtns.length; i++) {
                const rBtn = relatedBtns[i];

                rBtn.innerHTML = 'Agregar';
                rBtn.classList.remove('btn-dark');
                rBtn.classList.add('btn-danger');

                switch (btn_id[0]) {
                    case 'M':
                        delete materialesUsados[btn_id];
                        priceArray(materialesUsados, precioMaterialesSpan);

                        break;
                   

                }
            }

            inputs[0].value = 0;

            for (var i = 0; i < inputs.length; i++) {
                const inp = inputs[i];
                inp.setAttribute('disabled', 'disabled');
            }

            h_div.setAttribute('hidden', 'hidden');
        }
    });
}

setUp(materialesInputs, materialesUsados, precioMaterialesSpan);


calculateSub.addEventListener('click', function () {
    const materiales_price = parseFloat(
        precioMaterialesSpan.innerHTML.replaceAll(',', '')
    );

    //let subtotal = materiales_price + pintura_price + instalacion_price;

    materialPorcentajes.forEach((porcentaje) => {
        subtotal += materiales_price * (parseFloat(porcentaje.value) / 100);
    });

    subtotalHTML.innerHTML = `<h5 class="mb-3 resaltar-rojo">SubTotal: $${subtotal
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}  mxn</h5>`;
});

// -------------- Busqueda -------------- //
materialBusqueda.addEventListener('input', function () {
    filtrar(materialBusqueda, modalMateriales);
});

// -------------- Especificaciones -------------- //
plusOneBtn.addEventListener('click', function() {
    especs++;

    const div = document.createElement('div');
    div.classList.add('input-group', 'mb-2');
    div.id = `especificaciones-${especs}`;
    div.innerHTML = `
        <span class="input-group-text">${especs}</span>
        <input type="text" name="especificacionesNombre" class="form-control dynamic-input" placeholder="Nombre" required>
        <input type="text" name="especificacionesDesc" class="form-control dynamic-input" placeholder="Descripcion" required>
    `;

    especsDiv.appendChild(div);

    // Create and append the corresponding hidden inputs
    createHiddenInputs(especs, hiddenInputsContainer);
});

minusOneBtn.addEventListener('click', function() {
    if (especs > 0) {
        const lastEspec = document.querySelector(`#especificaciones-${especs}`);
        const lastHiddenEspecNombre = document.querySelector(`input[name='hiddenEspecificacionesNombre[${especs}]']`);
        const lastHiddenEspecDesc = document.querySelector(`input[name='hiddenEspecificacionesDesc[${especs}]']`);

        if (lastEspec) {
            lastEspec.remove();
        }

        if (lastHiddenEspecNombre) {
            lastHiddenEspecNombre.remove();
        }

        if (lastHiddenEspecDesc) {
            lastHiddenEspecDesc.remove();
        }

        especs--;
    }
});

function createHiddenInputs(index, container) {
    const hiddenInputNombre = document.createElement('input');
    hiddenInputNombre.type = 'hidden';
    hiddenInputNombre.name = `hiddenEspecificacionesNombre[${index}]`;

    const hiddenInputDesc = document.createElement('input');
    hiddenInputDesc.type = 'hidden';
    hiddenInputDesc.name = `hiddenEspecificacionesDesc[${index}]`;

    container.appendChild(hiddenInputNombre);
    container.appendChild(hiddenInputDesc);

    // Synchronize values between dynamic inputs and hidden inputs
    document.querySelectorAll(`#especificaciones-${index} .dynamic-input`).forEach((input, idx) => {
        input.addEventListener('input', function() {
            if (idx === 0) { // First input is for Nombre
                hiddenInputNombre.value = input.value;
            } else { // Second input is for Desc
                hiddenInputDesc.value = input.value;
            }
        });
    });
}
