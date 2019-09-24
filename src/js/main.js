import $ from 'jquery'
import svg4everybody from '../../node_modules/svg4everybody/dist/svg4everybody'
import '../../node_modules/select2/dist/js/select2.full'

$(document).ready(function () {

   // Function to make IE9+ support forEach:
   (function () {
      if (typeof NodeList.prototype.forEach === "function")
         return false;
      else
         NodeList.prototype.forEach = Array.prototype.forEach;
   })();


   // svg for IE11
   svg4everybody({});

   const navbar = document.querySelector('.header__navbar')
   init();

   $('.select').select2({
      minimumResultsForSearch: Infinity,
      width: 250,
      height: 32,
      containerCssClass: 'custom-select',
      dropdownCssClass: 'custom-dropdown',
   });

   function magnificPopupsInit() {
      let blocks = document.querySelectorAll('.p-menu__block');
      
      $('.header__burger-link').magnificPopup({
         type: 'inline',
         preloader: true,
         removalDelay: 300,
         mainClass: 'custom-mfp',
         showCloseBtn: false,
         fixedContentPos: true,
         fixedBgPos: true,

         callbacks: {
            open: function () {
               $('.p-menu__close-btn').on('click', function (event) {
                  event.preventDefault();
                  $.magnificPopup.close();
               });
               setTimeout(() => {
                  blocks.forEach(el => {
                     el.classList.add('active');
                  })
               }, 200);
            },
            close: function () {
               blocks.forEach(el => {
                  el.classList.remove('active');
               })
            },
         }
      });
   }


   // ----------------------- SETTINGS

   function init() {
      magnificPopupsInit();
      setEventListeners();
   }

   function setEventListeners() {
      let menuBtn = document.querySelector('.header__menu-item_select');
      let cityBtn = document.querySelector('.header__location');

      if (document.documentElement.clientWidth > 1183) {
         menuBtn.addEventListener('mouseover', showDropdown);
         cityBtn.addEventListener('mouseover', showDropdown);
         menuBtn.addEventListener('mouseleave', hideDropdown);
         cityBtn.addEventListener('mouseleave', hideDropdown);
      }
      else {
         menuBtn.removeEventListener('mouseover', showDropdown);
         cityBtn.removeEventListener('mouseover', showDropdown);
         menuBtn.removeEventListener('mouseleave', hideDropdown);
         cityBtn.removeEventListener('mouseleave', hideDropdown);
      }

      window.addEventListener('resize', setEventListeners);
   }


   // ----------------------- HEADER
   function showDropdown() {
      let element = this.getAttribute('data-dropdown');
      let dropdown = document.querySelector(element);

      dropdown.classList.add('header__dropdown-active');
      dropdown.addEventListener('mouseover', function () {
         this.classList.add('header__dropdown-active')
      })
   }
   function hideDropdown() {
      let dropdowns = document.querySelectorAll('.header__dropdown')
      setTimeout(() => {
      }, 0);
      dropdowns.forEach(item => {
         item.classList.remove('header__dropdown-active');
         item.addEventListener('mouseleave', function () {
            this.classList.remove('header__dropdown-active');
         });
      });
   }
})