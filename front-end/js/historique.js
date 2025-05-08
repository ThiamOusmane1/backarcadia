document.addEventListener('DOMContentLoaded', () => {

    const apiUrl = 'https://arcadia-zoo-vcms.onrender.com'; // URL de l'API

    // Fonction pour récupérer et afficher l'historique d'un animal
    async function fetchHistorique(animalId) {
        try {
            // Appel de l'API pour obtenir l'historique de l'animal avec fetch
            const response = await fetch(`${apiUrl}/api/animals/${animalId}/historique`);
            
            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des données: ${response.statusText}`);
            }
            
            const data = await response.json(); // Récupérer les données JSON de la réponse
            console.log('Historique de l\'animal:', data);

            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = ''; // Réinitialise la modale

            if (Array.isArray(data) && data.length > 0) {
                // Parcours et affichage de l'historique
                data.forEach(entry => {
                    const historyEntry = document.createElement('p');
                    historyEntry.textContent = `Date: ${new Date(entry.date).toLocaleDateString()}, Détail: ${entry.detail}`;
                    modalBody.appendChild(historyEntry);
                });
            } else {
                // Message si aucun historique n'est trouvé
                modalBody.innerHTML = '<p>Aucun historique disponible pour cet animal.</p>';
            }

            // Afficher la modale (utiliser jQuery ou autre pour la modale)
            $('#animalModal').modal('show');

        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique :', error);

            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = '<p>Erreur lors de la récupération de l\'historique. Veuillez réessayer plus tard.</p>';
            $('#animalModal').modal('show');
        }
    }

    // Ajout d'un événement pour déclencher l'affichage de l'historique
    document.querySelectorAll('.view-history-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const animalId = this.getAttribute('data-animal-id');
            fetchHistorique(animalId); // Appel de la fonction fetchHistorique avec l'ID de l'animal
        });
    });
});
