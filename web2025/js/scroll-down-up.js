let lastScroll = 0;
const navbar = document.querySelector('.nav-bar-jongo');
const scrollThreshold = 100; // Pixeles de scroll antes de ocultar
const navbarHeight = navbar.offsetHeight;

// Inicializamos la barra como visible
navbar.classList.add('visible');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Siempre mostrar en la parte superior
  if (currentScroll <= 0) {
    navbar.classList.remove('hidden');
    navbar.classList.add('visible');
    return;
  }

  // Comportamiento basado en la dirección del scroll
  if (currentScroll > lastScroll) {
    // Scroll hacia abajo
    if (currentScroll > scrollThreshold && !navbar.classList.contains('hidden')) {
      navbar.classList.add('hidden');
      navbar.classList.remove('visible');
    }
  } else {
    // Scroll hacia arriba
    if (navbar.classList.contains('hidden')) {
      navbar.classList.remove('hidden');
      navbar.classList.add('visible');
    }
  }
  
  lastScroll = currentScroll;
});