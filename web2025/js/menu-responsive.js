document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.menu-toggle').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('.modal').classList.toggle('active');
  });

  document.querySelector('.close-modal').addEventListener('click', function() {
    document.querySelector('.menu-toggle').classList.remove('active');
    document.querySelector('.modal').classList.remove('active');
  });
});

