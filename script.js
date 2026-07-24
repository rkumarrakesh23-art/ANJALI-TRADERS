// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));

        if(target){
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

// Header Shadow
window.addEventListener("scroll", function(){

    const header=document.querySelector(".header");

    if(header){

        if(window.scrollY>30){
            header.style.boxShadow="0 5px 15px rgba(0,0,0,.2)";
        }else{
            header.style.boxShadow="none";
        }

    }

});
