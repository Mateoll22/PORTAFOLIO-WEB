// CARRUSEL AUTOMÁTICO PARA TARJETAS DE PROYECTOS

const carruseles = document.querySelectorAll('.proyecto-carousel');

carruseles.forEach(carousel => {
    const imagenes = carousel.querySelectorAll('img');

    // Si el proyecto tiene 1 sola imagen o ninguna, no hace falta animarlo
    if (imagenes.length <= 1) return;

    let indice = 0;
    let pausado = false;

    // Pausar cuando el mouse está sobre la tarjeta del proyecto
    const tarjeta = carousel.closest('.proyecto-card') || carousel;

    tarjeta.addEventListener('mouseenter', () => {
        pausado = true;
    });

    tarjeta.addEventListener('mouseleave', () => {
        pausado = false;
    });

    // Cambiar de imagen suavemente cada 4 segundos
    setInterval(() => {
        if (pausado) return;

        imagenes[indice].classList.remove('active');
        indice = (indice + 1) % imagenes.length;
        imagenes[indice].classList.add('active');
    }, 4000);
});

// LIGHTBOX (ZOOM CON FLECHAS Y NAVEGACIÓN)

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCerrar = document.getElementById('lightbox-cerrar');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let imagenesProyectoActual = [];
let indiceLightbox = 0;

function mostrarImagenLightbox() {
    const img = imagenesProyectoActual[indiceLightbox];
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
}

function cambiarImagenLightbox(direccion) {
    if (imagenesProyectoActual.length <= 1) return;
    indiceLightbox = (indiceLightbox + direccion + imagenesProyectoActual.length) % imagenesProyectoActual.length;
    mostrarImagenLightbox();
}

// Abrir el lightbox cargando todas las imágenes de esa tarjeta
carruseles.forEach(carousel => {
    carousel.addEventListener('click', () => {
        const imagenes = Array.from(carousel.querySelectorAll('img'));
        if (imagenes.length === 0) return;

        imagenesProyectoActual = imagenes;
        const indiceActivo = imagenes.findIndex(img => img.classList.contains('active'));
        indiceLightbox = indiceActivo >= 0 ? indiceActivo : 0;

        // Ocultar flechas si el proyecto solo tiene 1 imagen
        const mostrarFlechas = imagenes.length > 1 ? 'flex' : 'none';
        lightboxPrev.style.display = mostrarFlechas;
        lightboxNext.style.display = mostrarFlechas;

        mostrarImagenLightbox();
        lightbox.classList.add('activo');
    });
});

function cerrarLightbox() {
    lightbox.classList.remove('activo');
}

lightboxCerrar.addEventListener('click', cerrarLightbox);
lightboxPrev.addEventListener('click', () => cambiarImagenLightbox(-1));
lightboxNext.addEventListener('click', () => cambiarImagenLightbox(1));

// Cerrar al hacer clic en el fondo oscuro
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        cerrarLightbox();
    }
});

// Controles con teclado (Escape, Izquierda y Derecha)
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('activo')) return;
    if (e.key === 'Escape') cerrarLightbox();
    if (e.key === 'ArrowLeft') cambiarImagenLightbox(-1);
    if (e.key === 'ArrowRight') cambiarImagenLightbox(1);
});