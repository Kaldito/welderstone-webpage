window.onscroll = function() {
    if(document.documentElement.scrollTop > 100){
        document.querySelector(".go-top-container").classList.add("show-popup");
    } else{
        document.querySelector(".go-top-container").classList.remove("show-popup");
    }
}

const form = document.querySelector('#form');

document.querySelector(".go-top-container").addEventListener("click", () => {
    form.submit();
})


