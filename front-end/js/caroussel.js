document.addEventListener('DOMContentLoaded', function() {
    // Gestion du carrousel de présentation
    const presentationCarousel = document.querySelector('#presentationCarousel');
    if (presentationCarousel) {
        // Configuration du carrousel Bootstrap 
        new bootstrap.Carousel(presentationCarousel, {
            interval: 3000,
            wrap: true
        });
    }

    // Gestion du carrousel des avis
    const reviewCarousel = document.querySelector('#reviewCarousel');
    if (reviewCarousel) {

        new bootstrap.Carousel(reviewCarousel, {
            interval: 5000,
            wrap: true
        });
    }
});
