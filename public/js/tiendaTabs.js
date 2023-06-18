function ajustarTabs() {
    const hogarTab = document.getElementById("hogar-tab");
    const industriaTab = document.getElementById("industria-tab");
    const urbanismoTab = document.getElementById("urbanismo-tab");
    const ganaderoTab = document.getElementById("ganadero-tab");
    const CYRTab = document.getElementById("c-y-r-tab");
    const especialesTab = document.getElementById("especiales-tab");

    // Hacer que si el ancho de la pantalla es menor o igual a 576px, el innerHTML de los tabs sea solo el icono
    if (window.innerWidth <= 576) {
        hogarTab.innerHTML = '<i class="fa-solid fa-house"></i>';
        industriaTab.innerHTML = '<i class="fa-solid fa-industry"></i>';
        urbanismoTab.innerHTML = '<i class="fa-solid fa-tree-city"></i>';
        ganaderoTab.innerHTML = '<i class="fa-solid fa-cow"></i>';
        CYRTab.innerHTML = '<i class="fa-solid fa-recycle"></i>';
        especialesTab.innerHTML = '<i class="fa-solid fa-clipboard"></i>';
    } else {
        hogarTab.innerHTML = "Hogar";
        industriaTab.innerHTML = "Industria";
        urbanismoTab.innerHTML = "Urbanismo";
        ganaderoTab.innerHTML = "Ganadero";
        CYRTab.innerHTML = "Construccion y Reciclados";
        especialesTab.innerHTML = "Especiales";
    }
}

// Ejecutar la función al cargar la página
document.addEventListener("DOMContentLoaded", ajustarTabs);

// Agregar una función de escucha para el evento resize
window.addEventListener("resize", ajustarTabs);
