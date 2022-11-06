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

