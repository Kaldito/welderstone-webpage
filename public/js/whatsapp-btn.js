const whatsappBtn = document.getElementById("whatsapp-btn");

whatsappBtn.addEventListener("click", () => {
    const phoneNumber = "8712174679"; // Reemplaza esto con tu número de teléfono
    const message = "¡Escribe aquí como podemos ayudarte!"; // Reemplaza esto con el mensaje que quieras enviar
    
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    window.open(whatsappLink, "_blank");
});