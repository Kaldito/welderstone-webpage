const whatsappBtn = document.getElementById('whatsapp-btn');

whatsappBtn.addEventListener('click', () => {
    const phoneNumber = '+528712646982'; // Reemplaza esto con tu número de teléfono
    const message = '¡Me gustaria pedir informes!'; // Reemplaza esto con el mensaje que quieras enviar

    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
        message
    )}`;

    window.open(whatsappLink, '_blank');
});
