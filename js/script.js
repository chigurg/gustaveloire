const menu = document.getElementById('visibility');
const menuButton = document.getElementById('menuButton');

let visible = false;

function setVisState(){
  if(visible == false){
    gsap.to('.navbar', {y:0, duration: 0.1})
    visible = true;
  }
  else{
    gsap.to('.navbar', {y:-1200, duration: 0.1});
    visible = false;
  }
}

menuButton.addEventListener('click', setVisState);



const buttons = document.querySelectorAll("[data-carousel-button]")

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const offset = button.dataset.carouselButton === "next" ? 1 : -1
    const slides = button
      .closest("[data-carousel]")
      .querySelector("[data-slides]")

    const activeSlide = slides.querySelector("[data-active]")
    let newIndex = [...slides.children].indexOf(activeSlide) + offset
    if (newIndex < 0) newIndex = slides.children.length - 1
    if (newIndex >= slides.children.length) newIndex = 0

    slides.children[newIndex].dataset.active = true
    delete activeSlide.dataset.active
  })
})
