document.addEventListener('DOMContentLoaded', function () {
    console.log("Script chargé et DOM prêt.");

    const button = document.getElementById('leaveReviewBtn');
    const formSection = document.getElementById('reviewFormSection');
    const formReview = document.getElementById('reviewForm');
    const formConfirm = document.getElementById('formConfirmation');
    const apiUrl = 'https://back-arcadia.vercel.app';

    // Fonction pour afficher les avis
    async function displayReviews() {
        try {
            const response = await fetch(`${apiUrl}/api/reviews`);
            const reviews = await response.json();

            // Vider le conteneur des avis existants
            const reviewsContainer = document.querySelector('#reviewCarousel .carousel-inner');
            reviewsContainer.innerHTML = ''; // Effacer le contenu existant

            // Créer un élément pour chaque avis
            reviews.forEach((review, index) => {
                const reviewElement = document.createElement('div');
                
                // Ajout des classes pour les éléments du carrousel
                reviewElement.classList.add('carousel-item');
                if (index === 0) {
                    reviewElement.classList.add('active'); // Marquer le premier élément comme actif
                }

                reviewElement.innerHTML = `
                    <div class="carousel-caption">
                        <p>"${review.message}"</p>
                        <div class="carousel-footer">- ${review.name}</div>
                    </div>
                `;
                reviewsContainer.appendChild(reviewElement);
            });

            // Réinitialiser le carrousel pour afficher le premier élément
            $('#reviewCarousel').carousel(0);

        } catch (error) {
            console.error('Erreur lors de la récupération des avis :', error);
        }
    }

    if (button && formSection && formReview && formConfirm) {
        console.log("Éléments trouvés.");

        // Afficher le formulaire lorsque le bouton est cliqué
        button.addEventListener('click', function () {
            formSection.classList.remove('d-none'); // Affiche le formulaire
            formConfirm.classList.add('d-none'); // Cache le message de confirmation si visible
            console.log("Formulaire affiché.");
        });

        // Gérer la soumission du formulaire
        formReview.addEventListener('submit', async function (event) {
            event.preventDefault(); // Empêche le rechargement de la page
            console.log("Formulaire soumis.");

            // Récupérer les données du formulaire
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
            };

            console.log("Données du formulaire:", formData);

            try {
                // Envoyer les données au serveur avec fetch
                const response = await fetch(`${apiUrl}/api/reviews`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData), // Convertir en JSON
                });

                console.log("Réponse du serveur:", response.status);

                if (response.ok) {
                    console.log("Formulaire envoyé avec succès.");

                    // Masquer le formulaire
                    formSection.classList.add('d-none'); // Cache la section du formulaire

                    // Afficher un message de confirmation
                    setTimeout(function () {
                        formConfirm.classList.remove('d-none'); // Affiche le message de confirmation
                    }, 100); 

                    // Réinitialiser le formulaire
                    formReview.reset();

                    // Mettre à jour le carrousel avec le nouvel avis
                    await displayReviews(); // Réactualiser les avis affichés

                    // Masquer le message de confirmation après 3 secondes
                    setTimeout(function () {
                        formConfirm.classList.add('d-none'); // Cache le message de confirmation
                        console.log("Message de confirmation caché.");
                    }, 3000); // Délai de 3 secondes
                } else {
                    console.error("Erreur lors de l'envoi du formulaire");
                    alert("Erreur lors de l'envoi du formulaire. Veuillez réessayer.");
                }
            } catch (error) {
                console.error("Erreur lors de la requête:", error);
                alert("Erreur de connexion. Veuillez réessayer.");
            }
        });
    } else {
        console.error("Un ou plusieurs éléments manquent dans le DOM.");
    }

    // Charger les avis au démarrage
    displayReviews();
});


