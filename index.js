//jshint esversion:8
// GO TO TOP BUTTON
//Get the button:
mybutton = document.getElementById("myBtn");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
  if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 800) {
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
       theme_img.src = 'images/sun.svg';
   }else{
    document.documentElement.setAttribute('data-theme' , 'dark');
    localStorage.setItem('theme' , 'dark');
    theme_img.src = 'images/moon.svg';
   }
}
toggleSwitch.addEventListener('change' , switchTheme);
//Check Local Storage for theme
const currentTheme = localStorage.getItem('theme');
if(currentTheme){
    document.documentElement.setAttribute('data-theme' , currentTheme);
    if(currentTheme === 'light'){
        toggleSwitch.checked = true;
        theme_img.src = 'images/sun.svg';
    }
}

//Navbar
const navToggler = document.querySelector(".nav-toggler");
navToggler.addEventListener("click", navToggle);

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