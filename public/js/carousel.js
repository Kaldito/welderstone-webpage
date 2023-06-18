const carouselImgs = Array.from(document.getElementsByClassName("c-img"));

carouselImgs.forEach(img => {
    if(img.naturalWidth >= img.naturalHeight){
        img.classList.add("square-img")
    } else {
        img.classList.add("large-img")
    }
});
