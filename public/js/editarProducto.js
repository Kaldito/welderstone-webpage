// ---------- DOM MANIPULATION ---------- //
const precioMaterialesSpan = document.querySelector('#precio-materiales');
const subtotalHTML = document.querySelector('#subtotal');
const calculateSub = document.querySelector('#calculate-subtotal');
const materialPorcentajes = document.querySelectorAll('.material-porcentaje');
const cap = parseFloat(document.querySelector('#cap').innerHTML);
let especs = document.querySelectorAll('#especificaciones .input-group').length || 0;
const hiddenInputsContainer = document.querySelector('#hiddenInputsPlaceholder');
const materialesHiddenInputs = document.querySelector('#materialesHiddenInputs');
const plusOneBtn = document.querySelector('#plus-one');
const minusOneBtn = document.querySelector('#minus-one');
const especsDiv = document.querySelector('#especificaciones');
const materialBusqueda = document.querySelector('#mm-busqueda');
const modalMateriales = document.querySelectorAll('.modal-materiales');
const tableBody = document.querySelector('.table.align-middle.table-striped-columns tbody');

// ---------- GLOBAL CONST AND VARIABLES ---------- //
const materialesUsados = {};
let materialesInputs = document.querySelectorAll('.material-input');

// ---------- FUNCTIONS ---------- //
function setUp(inputs, objetoMateriales, objective) {
    inputs.forEach((inp) => {
        inp.addEventListener('input', function () {
            const materialId = inp.dataset.materialId;
            const cantidad = inp.value !== '' ? parseFloat(inp.value) : 0;
            if (cantidad >= 0) {
                objetoMateriales[materialId][1] = cantidad;
                updateHiddenInputs(materialId, cantidad);
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
        });
        const fprecio = precio.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        objective.innerHTML = fprecio;
    } else {
        objective.innerHTML = '0.00';
    }
}

function calculatePrice(objetoMateriales, objective) {
    for (const material in objetoMateriales) {
        const inp = objetoMateriales[material][2];
        const materialId = inp.dataset.materialId;
        const cantidad = inp.value !== '' ? parseFloat(inp.value) : 0;
        if (cantidad >= 0) {
            objetoMateriales[materialId][1] = cantidad;
            updateHiddenInputs(materialId, cantidad);
        }
    }
    priceArray(objetoMateriales, objective);
}

function updateHiddenInputs(materialId, cantidad) {
    let idInput = document.querySelector(`#materialesHiddenInputs input[data-material-id="${materialId}"][name="MaterialesProductos[_id][]"]`);
    let cantidadInput = document.querySelector(`#materialesHiddenInputs input[data-material-id="${materialId}"][name="MaterialesProductos[cantidad][]"]`);

    if (cantidad > 0) {
        if (!idInput) {
            idInput = document.createElement('input');
            idInput.type = 'hidden';
            idInput.name = 'MaterialesProductos[_id][]';
            idInput.setAttribute('data-material-id', materialId);
            materialesHiddenInputs.appendChild(idInput);
        }
        if (!cantidadInput) {
            cantidadInput = document.createElement('input');
            cantidadInput.type = 'hidden';
            cantidadInput.name = 'MaterialesProductos[cantidad][]';
            cantidadInput.setAttribute('data-material-id', materialId);
            materialesHiddenInputs.appendChild(cantidadInput);
        }
        idInput.value = materialId;
        cantidadInput.value = cantidad;
    } else {
        if (idInput) idInput.remove();
        if (cantidadInput) cantidadInput.remove();
    }
}
function filtrar(barraBusqueda, matArray) {
    const texto = barraBusqueda.value.toLowerCase();
    for (const material of matArray) {
        const nombre = material.id.toLowerCase();
        if (nombre.indexOf(texto) !== -1) {
            material.classList.remove('hide');
        } else {
            material.classList.add('hide');
        }
    }
}

function createMaterialRow(materialId, codigo, descripcion, precio, unidad) {
    if (!tableBody) {
        console.error('No se encontró el <tbody> en el DOM');
        return null;
    }
    const newRow = document.createElement('tr');
    newRow.classList.add('Material' + materialId, 'editDiv');
    newRow.setAttribute('data-material-id', materialId);

    const tdButton = document.createElement('td');
    tdButton.style.textAlign = 'center';
    tdButton.style.padding = '0';

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-dark', 'edit', `agregar-${materialId}`);
    button.setAttribute('data-material-id', materialId);
    button.value = precio;
    button.textContent = 'Quitar';

    tdButton.appendChild(button);

    newRow.innerHTML = `
        <th scope="row">${codigo}</th>
        <td>${descripcion}</td>
        <td>$${precio}/u</td>
        <td>Unidad: ${unidad}</td>
        <td>
            <input type="number" step="any" value="1" class="form-control material-input" min="0" data-material-id="${materialId}">
        </td>
    `;
    newRow.appendChild(tdButton);

    tableBody.appendChild(newRow);

    // Actualizar materialesUsados y hidden inputs
    const matInput = newRow.querySelector('.material-input');
    materialesUsados[materialId] = [parseFloat(precio), 1, matInput];
    updateHiddenInputs(materialId, 1);

    return newRow;
}

// ---------- MAIN ---------- //
// Inicializar filas existentes
document.querySelectorAll('.editDiv').forEach((ediv) => {
    const materialId = ediv.dataset.materialId;
    const btn = ediv.querySelector('.edit');
    const matInput = ediv.querySelector('.material-input');
    const cantidad = parseFloat(matInput.value) || 0;

    if (cantidad > 0) {
        materialesUsados[materialId] = [parseFloat(btn.value), cantidad, matInput];
        updateHiddenInputs(materialId, cantidad);
    }
});

// Actualizar botones en el modal
document.querySelectorAll('.modal-materiales .edit').forEach((btn) => {
    const materialId = btn.dataset.materialId;
    if (materialesUsados[materialId]) {
        btn.innerHTML = 'Quitar';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-dark');
    } else {
        btn.innerHTML = 'Agregar';
        btn.classList.remove('btn-dark');
        btn.classList.add('btn-danger');
    }
});

calculatePrice(materialesUsados, precioMaterialesSpan);
setUp(materialesInputs, materialesUsados, precioMaterialesSpan);
document.addEventListener('click', function (e) {
    if (!e.target.classList.contains('edit')) return;

    const btn = e.target;
    const materialId = btn.dataset.materialId;

    if (!materialId) {
        console.error('Botón sin data-material-id:', btn);
        return;
    }

    let h_div = document.querySelector(`.Material${materialId}`);
    const relatedBtns = document.querySelectorAll(`.agregar-${materialId}`);

    if (!h_div) {
        // Agregar material
        const codigo = btn.dataset.codigo;
        const descripcion = btn.dataset.descripcion;
        const precio = btn.dataset.precio;
        const unidad = btn.dataset.unidad;

        if (!codigo || !descripcion || !precio || !unidad) {
            console.error('Faltan datos en el botón:', btn);
            return;
        }

        h_div = createMaterialRow(materialId, codigo, descripcion, precio, unidad);
        if (!h_div) return;

        materialesInputs = document.querySelectorAll('.material-input');
        setUp(materialesInputs, materialesUsados, precioMaterialesSpan);

        for (let rBtn of relatedBtns) {
            rBtn.innerHTML = 'Quitar';
            rBtn.classList.remove('btn-danger');
            rBtn.classList.add('btn-dark');
        }
    } else {
        // Quitar material
        console.log('Eliminando material:', materialId); // Para depurar
        if (h_div) {
            h_div.remove();
        } else {
            console.error('No se encontró la fila para eliminar:', `.Material${materialId}`);
        }

        for (let rBtn of relatedBtns) {
            rBtn.innerHTML = 'Agregar';
            rBtn.classList.remove('btn-dark');
            rBtn.classList.add('btn-danger');
        }

        delete materialesUsados[materialId];
        updateHiddenInputs(materialId, 0);
        priceArray(materialesUsados, precioMaterialesSpan);
    }
});

// Calcular subtotal
calculateSub.addEventListener('click', function () {
    const materiales_price = parseFloat(precioMaterialesSpan.innerHTML.replaceAll(',', ''));
    let subtotal = materiales_price;

    materialPorcentajes.forEach((porcentaje) => {
        subtotal += materiales_price * (parseFloat(porcentaje.value) / 100);
    });

    subtotalHTML.innerHTML = `<h5 class="mb-3 resaltar-rojo">SubTotal: $${subtotal
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} mxn</h5>`;
});

// Búsqueda en el modal
materialBusqueda.addEventListener('input', function () {
    filtrar(materialBusqueda, modalMateriales);
});

// Especificaciones (sin cambios relevantes)
function updateEspecsCountAndIndices() {
    especs = document.querySelectorAll('#especificaciones .input-group').length;
    document.querySelectorAll('#especificaciones .input-group').forEach((group, index) => {
        const newIndex = index + 1;
        group.id = `especificaciones-${newIndex}`;
        group.querySelector('.input-group-text').textContent = newIndex;
        const inputs = group.querySelectorAll('.dynamic-input');
        if (inputs.length >= 2) {
            inputs[0].name = `especificacionesNombre[]`;
            inputs[1].name = `especificacionesDesc[]`;
        }
    });
}

plusOneBtn.addEventListener('click', function () {
    addDynamicInput();
    updateEspecsCountAndIndices();
});

minusOneBtn.addEventListener('click', function () {
    if (especs > 2) {
        removeDynamicInput();
        updateEspecsCountAndIndices();
    }
});

function addDynamicInput() {
    especs++;
    const div = createInputGroup(especs);
    especsDiv.appendChild(div);
    createHiddenInputs(especs);
}

function removeDynamicInput() {
    const lastInputGroup = document.querySelector(`#especificaciones .input-group:last-child`);
    if (lastInputGroup) {
        removeInputGroupAndHiddenInputs(lastInputGroup);
        especs--;
    }
}

function createInputGroup(index) {
    const div = document.createElement('div');
    div.classList.add('input-group', 'mb-2');
    div.id = `especificaciones-${index}`;
    div.innerHTML = `
        <span class="input-group-text">${index}</span>
        <input type="text" name="especificacionesNombre[]" class="form-control dynamic-input" placeholder="Nombre" required>
        <input type="text" name="especificacionesDesc[]" class="form-control dynamic-input" placeholder="Descripcion" required>
    `;
    return div;
}

function createHiddenInputs(index) {
    const hiddenInputNombre = document.createElement('input');
    hiddenInputNombre.type = 'hidden';
    hiddenInputNombre.name = `hiddenEspecificacionesNombre[]`;
    hiddenInputsContainer.appendChild(hiddenInputNombre);

    const hiddenInputDesc = document.createElement('input');
    hiddenInputDesc.type = 'hidden';
    hiddenInputDesc.name = `hiddenEspecificacionesDesc[]`;
    hiddenInputsContainer.appendChild(hiddenInputDesc);

    syncInputsWithHidden(index);
}

function syncInputsWithHidden(index) {
    const dynamicInputs = document.querySelectorAll(`#especificaciones-${index} .dynamic-input`);
    dynamicInputs.forEach((input, idx) => {
        input.addEventListener('input', function () {
            const hiddenInput = hiddenInputsContainer.children[idx + (index - 1) * 2];
            if (hiddenInput) {
                hiddenInput.value = input.value;
            }
        });
    });
}

function removeInputGroupAndHiddenInputs(inputGroup) {
    const index = parseInt(inputGroup.id.split('-')[1]);
    const hiddenInputs = hiddenInputsContainer.children;
    const startIdx = (index - 1) * 2;
    if (hiddenInputs[startIdx]) hiddenInputs[startIdx].remove();
    if (hiddenInputs[startIdx]) hiddenInputs[startIdx].remove();
    inputGroup.remove();
}

updateEspecsCountAndIndices();