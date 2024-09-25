document.addEventListener('DOMContentLoaded', () => {
    const animalGallery = document.getElementById('animal-gallery');

    function fetchAnimals(habitatName) {
        fetch(`http://localhost:3002/api/animals?habitat=${encodeURIComponent(habitatName)}`, {
            method: 'GET',
            mode: 'cors',  // Ajout de CORS
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            animalGallery.innerHTML = '';

            if (data.length === 0) {
                animalGallery.innerHTML = '<p>Aucun animal trouvé pour cet habitat.</p>';
                return;
            }

            data.forEach(animal => {
                const animalCard = document.createElement('div');
                animalCard.className = 'col-md-4 mb-4';
                animalCard.innerHTML = `
                    <div class="card animal-card" data-animal-id="${animal._id}">
                        <img src="/pictures/${animal.url}" class="card-img-top" alt="${animal.nom}" style="cursor: pointer;">
                        <div class="card-body">
                            <h5 class="card-title">${animal.nom}</h5>
                            <button class="btn btn-primary view-details-btn" data-animal-id="${animal._id}">Voir les détails</button>
                        </div>
                    </div>
                `;
                animalGallery.appendChild(animalCard);
            });

        })
        .catch(error => console.error('Erreur lors de la récupération des animaux:', error));
    }

    animalGallery.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-details-btn')) {
            const animalId = e.target.getAttribute('data-animal-id');
            fetchAnimalDetails(animalId);
        }
    });

    function fetchAnimalDetails(animalId) {
        fetch(`http://localhost:3002/api/animal-details?id=${encodeURIComponent(animalId)}`, {
            method: 'GET',
            mode: 'cors',  // Ajout de CORS
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            return response.json();
        })
        .then(animal => {
            updateConsultationCounter(animalId);

            const imageUrl = `/pictures/${animal.url}`;
            document.getElementById('modal-body').innerHTML = `
                <img src="${imageUrl}" class="img-fluid mb-3" alt="${animal.nom}">
                <h5>${animal.nom}</h5>
                <p><strong>Santé:</strong> ${animal.sante}</p>
                <p><strong>Poids:</strong> ${animal.poids} kg</p>
                <p><strong>Nourriture:</strong> ${animal.nourriture}</p>
                <p><strong>Quantité:</strong> ${animal.quantite}</p>
                <p><strong>Consultations:</strong> ${animal.consultations}</p>
                <p><strong>Soins:</strong> ${animal.soins}</p>
                <button id="show-historique-btn" class="btn btn-info">Afficher l'historique</button>
            `;
            $('#animalModal').modal('show');

            // Ajout de l'écouteur d'événements pour le bouton "Afficher l'historique"
            document.getElementById('modal-body').addEventListener('click', (e) => {
                if (e.target.id === 'show-historique-btn') {
                    afficherHistorique(animalId); // Appelle la fonction pour afficher l'historique
                }
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des détails de l\'animal:', error));
    }

    function updateConsultationCounter(animalId) {
        console.log('Animal ID:', animalId);
        fetch('http://localhost:3002/api/update-counter', {
            method: 'POST',
            mode: 'cors',  // Ajout de CORS
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: animalId }) // Envoi l'ID dans le corps de la requête
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du compteur de consultations');
            }
            return response.json();
        })
        .then(data => {
            console.log('Compteur mis à jour:', data);
        })
        .catch(error => console.error('Erreur lors de la mise à jour du compteur de consultations:', error));
    }

    // Fonction pour afficher l'historique d'un animal
    function afficherHistorique(animalId) {
        fetch(`http://localhost:3002/api/animals/${animalId}/historique`)  // URL corrigée pour inclure l'animalId
            .then(response => response.json())
            .then(data => {
                console.log('Historique de l\'animal:', data);

                // Afficher l'historique dans une modale
                const modalBody = document.getElementById('modal-body');
                modalBody.innerHTML = ''; // Vide le contenu précédent
                if (Array.isArray(data)) {
                    data.forEach(entry => {
                        const historyEntry = document.createElement('p');
                        historyEntry.textContent = `date: ${entry.date}, action: ${entry.action}`;
                        modalBody.appendChild(historyEntry);
                    });
                } else {
                    modalBody.innerHTML = '<p>Aucun historique trouvé pour cet animal.</p>';
                }

                // Ouvre la modale
                $('#animalModal').modal('show');
            })
            .catch(error => console.error('Erreur lors de la récupération de l\'historique :', error));
    }

    document.getElementById('habitats-list').addEventListener('click', (e) => {
        const habitatCard = e.target.closest('.ha-card');
        if (habitatCard) {
            const habitatName = habitatCard.getAttribute('data-habitat');
            fetchAnimals(habitatName);
        }
    });

});






            