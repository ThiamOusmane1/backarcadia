document.addEventListener('DOMContentLoaded', () => {
    const animalGallery = document.getElementById('animal-gallery');
    
    // Fonction pour récupérer les animaux par habitat
    async function fetchAnimals(habitatName) {
        try {
            const response = await fetch(`https://backarcadia-app.vercel.app/api/habitats/${encodeURIComponent(habitatName)}`);
            const habitat = await response.json();
            
            animalGallery.innerHTML = ''; // Clear previous entries

            if (!habitat || habitat.animaux.length === 0) {
                animalGallery.innerHTML = '<p>Aucun animal trouvé pour cet habitat.</p>';
                return;
            }

            habitat.animaux.forEach(animal => {
                const animalCard = document.createElement('div');
                animalCard.className = 'col-md-4 mb-4';
                animalCard.innerHTML = `
                    <div class="card animal-card" data-animal-id="${animal.id}">
                        <img src="/pictures/${animal.url}" class="card-img-top" alt="${animal.nom}" style="cursor: pointer;">
                        <div class="card-body">
                            <h5 class="card-title">${animal.nom}</h5>
                            <button class="btn btn-primary view-details-btn" data-animal-id="${animal.id}">Voir les détails</button>
                        </div>
                    </div>
                `;
                animalGallery.appendChild(animalCard);
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des animaux:', error);
        }
    }

    // Fonction pour récupérer les détails d'un animal
    async function fetchAnimalDetails(animalId) {
        try {
            const response = await fetch(`https://backarcadia-app.vercel.app/api/animals/${encodeURIComponent(animalId)}`);
            const animal = await response.json();
            
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

            // Écouter le clic pour afficher l'historique
            document.getElementById('modal-body').addEventListener('click', (e) => {
                if (e.target.id === 'show-historique-btn') {
                    afficherHistorique(animalId);
                }
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de l\'animal:', error);
        }
    }

    // Fonction pour mettre à jour le compteur de consultations
    async function updateConsultationCounter(animalId) {
        try {
            const response = await fetch('https://backarcadia-app.vercel.app/api/animals/update-counter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: animalId })
            });

            const data = await response.json();
            console.log('Compteur mis à jour:', data);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du compteur de consultations:', error);
        }
    }

    // Fonction pour afficher l'historique d'un animal
    async function afficherHistorique(animalId) {
        try {
            const response = await fetch(`https://backarcadia-app.vercel.app/api/animals/${animalId}/historique`);
            const data = await response.json();

            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = ''; // Vide le contenu précédent
            
            if (Array.isArray(data)) {
                data.forEach(entry => {
                    const historyEntry = document.createElement('p');
                    historyEntry.textContent = `Date: ${entry.date}, Action: ${entry.action}`;
                    modalBody.appendChild(historyEntry);
                });
            } else {
                modalBody.innerHTML = '<p>Aucun historique trouvé pour cet animal.</p>';
            }

            $('#animalModal').modal('show');
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique :', error);
        }
    }

    // Écouter les clics sur la liste des habitats
    document.getElementById('habitats-list').addEventListener('click', (e) => {
        const habitatCard = e.target.closest('.ha-card');
        if (habitatCard) {
            const habitatName = habitatCard.getAttribute('data-habitat');
            fetchAnimals(habitatName);
        }
    });
});







            