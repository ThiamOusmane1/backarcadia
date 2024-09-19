document.addEventListener('DOMContentLoaded', function() {
    console.log("Script chargé et DOM prêt.");  // Vérifie que le script est bien exécuté

    const button = document.getElementById('leaveReviewBtn');
    const formSection = document.getElementById('reviewFormSection');
    const formReview = document.getElementById('reviewForm');
    const formConfirm = document.getElementById('formConfirmation');

    if (button && formSection && formReview && formConfirm) {
        console.log("Éléments trouvés.");  // Vérifie que les éléments existent dans le DOM

        // Afficher le formulaire lorsque le bouton est cliqué
        button.addEventListener('click', function() {
            formSection.classList.remove('d-none'); // Affiche le formulaire
            formConfirm.classList.add('d-none'); // Cache le message de confirmation si visible
            console.log("Formulaire affiché.");  // Vérifie que le formulaire est bien affiché
        });

        // Gérer la soumission du formulaire
        formReview.addEventListener('submit', async function(event) {
            event.preventDefault();  // Empêche le rechargement de la page
            console.log("Formulaire soumis.");  // Vérifie que le formulaire a bien été soumis

            // Récupérer les données du formulaire
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
            };

            console.log("Données du formulaire:", formData);  // Vérifie les données récupérées

            const apiUrl = '/api';

            try {
                // Envoyer les données au serveur
                const response = await fetch('${apiUrl}/api/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                console.log("Réponse du serveur:", response.status);  // Vérifie la réponse du serveur

                if (response.ok) {
                    console.log("Formulaire envoyé avec succès.");  // Vérifie si la requête a réussi

                    // Masquer le formulaire
                    formSection.classList.add('d-none');  // Cache la section du formulaire

                    // Afficher un message de confirmation avec un léger délai pour s'assurer qu'il apparaît
                    setTimeout(function() {
                        formConfirm.classList.remove('d-none');  // Affiche le message de confirmation
                    }, 100);  // Légère attente avant d'afficher le message

                    // Réinitialiser le formulaire
                    formReview.reset();

                    // Masquer le message de confirmation après 3 secondes
                    setTimeout(function() {
                        formConfirm.classList.add('d-none');  // Cache le message de confirmation
                        console.log("Message de confirmation caché.");  // Vérifie si le message a bien été caché
                    }, 3000);  // Délai de 3 secondes
                } else {
                    console.error("Erreur lors de l'envoi du formulaire");
                }
            } catch (error) {
                console.error("Erreur lors de la requête:", error);
            }
        });
    } else {
        console.error("Un ou plusieurs éléments manquent dans le DOM.");
    }
});
