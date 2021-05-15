
var navMain = document.querySelector('.page-header');
var navToggle = document.querySelector('.page-header--main-nav-closed');


navToggle.addEventListener('click', function() {
  if (navMain.classList.contains('page-header--main-nav-closed')) {
    navMain.classList.remove('page-header--main-nav-closed');
    navMain.classList.add('page-header--main-nav-open');
  } else {
    navMain.classList.add('page-header--main-nav-closed');
    navMain.classList.remove('page-header--main-nav-open');
  }
});
