document.addEventListener('DOMContentLoaded', function () {
    //console.log("Script chargé et DOM prêt.");

    const apiUrl = 'https://arcadia-zoo-vcms.onrender.com';// URL de l'API

    const button = document.getElementById('leaveReviewBtn');
    const formSection = document.getElementById('reviewFormSection');
    const formReview = document.getElementById('reviewForm');
    const formConfirm = document.getElementById('formConfirmation');

    // Fonction pour afficher les avis
    async function displayReviews() {
        try {
            const response = await fetch(`${apiUrl}/api/reviews`);
            const reviews = await response.json();

            if (!Array.isArray(reviews)) {
                console.error('Réponse inattendue du serveur (non-array) :', reviews);
                return;
            }

            const reviewsContainer = document.querySelector('#reviewCarousel .carousel-inner');
            if (!reviewsContainer) {
                console.error("Conteneur du carrousel introuvable.");
                return;
            }

            reviewsContainer.innerHTML = ''; // Reset du carrousel

            reviews.forEach((review, index) => {
                const item = document.createElement('div');
                item.classList.add('carousel-item');
                if (index === 0) item.classList.add('active');

                item.innerHTML = `
                    <div class="carousel-caption">
                        <p>"${review.message}"</p>
                        <div class="carousel-footer">- ${review.name}</div>
                    </div>
                `;
                reviewsContainer.appendChild(item);
            });

            $('#reviewCarousel').carousel(0); // Reset carrousel
        } catch (error) {
            console.error('Erreur lors de la récupération des avis :', error);
            alert("Impossible de charger les avis pour le moment.");
        }
    }

    // Gestion du bouton "Laisser un avis"
    if (button && formSection && formReview && formConfirm) {
        button.addEventListener('click', function () {
            formSection.classList.remove('d-none');
            formConfirm.classList.add('d-none');
        });

        formReview.addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
            };

            try {
                const response = await fetch(`${apiUrl}/api/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    formReview.reset();
                    formSection.classList.add('d-none');
                    formConfirm.classList.remove('d-none');
                    await displayReviews();

                    setTimeout(() => {
                        formConfirm.classList.add('d-none');
                    }, 3000);
                } else {
                    const err = await response.json();
                    alert("Erreur lors de l'envoi du formulaire : " + (err?.message || response.statusText));
                }
            } catch (error) {
                console.error("Erreur réseau :", error);
                alert("Erreur réseau. Veuillez réessayer.");
            }
        });
    } else {
        console.error("Un ou plusieurs éléments sont manquants dans le DOM.");
    }

    displayReviews(); // Charger les avis au chargement
});


