document.addEventListener('DOMContentLoaded', function() {
    // Structure des détails des services
    const serviceDetails = {
        1: {
            title: "Ballade en Petit Train",
            image: "pictures/train.jpg",
            description: "Offrez-vous une balade relaxante à travers notre magnifique zoo avec notre petit train. Adaptée à toute la famille, cette promenade vous permet de découvrir tous les recoins du parc tout en profitant du confort du train. Une expérience idéale pour les petits et grands!",
            buttonText: "Réservez Maintenant",
            link: "reservation.html"
        },
        2: {
            title: "Visites Guidées",
            image: "pictures/parcours.jpg",
            description: "Nos visites guidées, menées par des experts passionnés, vous offrent une occasion unique d'en apprendre davantage sur les animaux du zoo et leurs habitats. Vous découvrirez des anecdotes fascinantes et des informations éducatives tout en explorant les différentes zones du parc.",
            buttonText: "Réservez Maintenant",
            link: "reservation.html"
        },
        3: {
            title: "Animations pour Enfants",
            image: "pictures/alpaca.jpg",
            description: "Nous offrons une variété d'animations pour les enfants, incluant des ateliers éducatifs, des jeux interactifs et des rencontres rapprochées avec certains animaux. C'est une opportunité pour les plus jeunes d'apprendre en s'amusant, tout en développant une connexion avec la nature.",
            buttonText: "Réservez Maintenant",
            link: "reservation.html"
        }
    };

    // Sélectionner tous les boutons Voir Détails et la section pour les détails
    const detailButtons = document.querySelectorAll('.see-details-btn');
    const detailsContainer = document.getElementById('service-details-container');

    // Ajouter des écouteurs d'événements pour chaque bouton
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Récupérer l'index du service
            const serviceIndex = this.getAttribute('data-service');
            if (!serviceDetails[serviceIndex]) {
                console.error('Aucun détail disponible pour ce service.');
                return;
            }

            // Générer le contenu HTML pour le service
            const service = serviceDetails[serviceIndex];
            const serviceHtml = `
                <div class="service-detail-card card mb-4">
                    <div class="row no-gutters">
                        <div class="col-md-6">
                            <img src="${service.image}" class="card-img" alt="${service.title}">
                        </div>
                        <div class="col-md-6">
                            <div class="card-body">
                                <h3 class="card-title">${service.title}</h3>
                                <p class="card-text">${service.description}</p>
                                <a href="${service.link}" class="btn btn-success">${service.buttonText}</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Insérer le contenu HTML dans la section des détails
            detailsContainer.innerHTML = serviceHtml;

            // Faire défiler vers la section affichée
            detailsContainer.scrollIntoView({
                behavior: 'smooth', // Défilement fluide
                block: 'start'      // Défilement en haut de la section
            });
        });
    });
});
