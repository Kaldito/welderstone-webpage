function checkform() {
    if(document.forms["registerForm"]["password"].value == document.forms["registerForm"]["confirmation"].value) {
        return true;
    } else {
        alert("Contraseña incorrecta");
        return false;
    }
}