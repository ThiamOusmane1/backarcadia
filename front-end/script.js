const apiUrl = 'https://arcadia-back-olive.vercel.app'; // Remplacez par l'URL de votre API

// Fonction pour récupérer les animaux par habitat
async function fetchAnimals(habitatName) {
    try {
        const response = await fetch(`${apiUrl}/api/habitats/${encodeURIComponent(habitatName)}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des animaux');
        }
        const habitat = await response.json();
        
        const animalGallery = document.getElementById('animalGallery');
        animalGallery.innerHTML = ''; 

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
                        <p class="card-text">${animal.description}</p>
                    </div>
                </div>
            `;
            animalGallery.appendChild(animalCard);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des animaux:', error);
        const animalGallery = document.getElementById('animalGallery');
        animalGallery.innerHTML = '<p>Erreur lors de la récupération des animaux.</p>';
    }
}

// Fonction pour récupérer les détails d'un animal
async function fetchAnimalDetails(animalId) {
    try {
        const response = await fetch(`${apiUrl}/api/animals/${encodeURIComponent(animalId)}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des détails de l\'animal');
        }
        const animal = await response.json();
        
        updateConsultationCounter(animalId);

        const imageUrl = `/pictures/${animal.url}`;
        document.getElementById('modal-body').innerHTML = `
            <img src="${imageUrl}" class="img-fluid mb-3" alt="${animal.nom}">
            <h5>${animal.nom}</h5>
            <p>${animal.description}</p>
        `;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'animal:', error);
        document.getElementById('modal-body').innerHTML = '<p>Erreur lors de la récupération des détails de l\'animal.</p>';
    }
}

// Fonction pour mettre à jour le compteur de consultations
async function updateConsultationCounter(animalId) {
    try {
        const response = await fetch(`${apiUrl}/api/animals/update-counter`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: animalId })
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du compteur de consultations');
        }
        const result = await response.json();
        console.log('Compteur mis à jour:', result.counter);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du compteur de consultations:', error);
    }
}

// Fonction pour afficher l'historique d'un animal
async function afficherHistorique(animalId) {
    try {
        const response = await fetch(`${apiUrl}/api/animals/${animalId}/historique`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de l\'historique de l\'animal');
        }
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
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique de l\'animal:', error);
        document.getElementById('modal-body').innerHTML = '<p>Erreur lors de la récupération de l\'historique de l\'animal.</p>';
    }
}

// Exemple d'appel de la fonction fetchAnimals
document.addEventListener('DOMContentLoaded', () => {
    const habitatName = 'Savane'; // Remplacez par le nom de l'habitat que vous souhaitez récupérer
    fetchAnimals(habitatName);
});

// Ajoutez un écouteur d'événement pour les cartes d'animaux
document.addEventListener('click', (event) => {
    const animalCard = event.target.closest('.animal-card');
    if (animalCard) {
        const animalId = animalCard.getAttribute('data-animal-id');
        fetchAnimalDetails(animalId);
    }
});







            