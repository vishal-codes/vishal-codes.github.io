//jshint esversion:8
// GO TO TOP BUTTON
//Get the button:
mybutton = document.getElementById("myBtn");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
  if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
};
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// THEME TOGGLE
const theme_img = document.getElementById("theme-img");
const toggleSwitch = document.getElementById("toggle-check");
//Switch Theme
function switchTheme(event){
   if(event.target.checked){
       document.documentElement.setAttribute('data-theme' , 'light');
       localStorage.setItem('theme' , 'light');
       theme_img.src = 'icons/sun.svg';
   }else{
    document.documentElement.setAttribute('data-theme' , 'dark');
    localStorage.setItem('theme' , 'dark');
    theme_img.src = 'icons/moon.svg';
   }
}
toggleSwitch.addEventListener('change' , switchTheme);
//Check Local Storage for theme
const currentTheme = localStorage.getItem('theme');
if(currentTheme){
    document.documentElement.setAttribute('data-theme' , currentTheme);
    if(currentTheme === 'light'){
        toggleSwitch.checked = true;
        theme_img.src = 'icons/sun.svg';
    }
}

//Navbar
const navToggler = document.querySelector(".nav-toggler");
const navCloseLi0 = document.querySelector(".nav-close-li-0");
const navCloseLi1 = document.querySelector(".nav-close-li-1");
const navCloseLi2 = document.querySelector(".nav-close-li-2");
const navCloseLi3 = document.querySelector(".nav-close-li-3");
navToggler.addEventListener("click", navToggle);
navCloseLi0.addEventListener("click", navToggle);
navCloseLi1.addEventListener("click", navToggle);
navCloseLi2.addEventListener("click", navToggle);
navCloseLi3.addEventListener("click", navToggle);

function navToggle() {
   navToggler.classList.toggle("active");
   const nav = document.querySelector(".nav");
   nav.classList.toggle("open");
   if(nav.classList.contains("open")){
     nav.style.maxHeight = "100vh";
   }
   else{
     nav.removeAttribute("style");
   }
} 