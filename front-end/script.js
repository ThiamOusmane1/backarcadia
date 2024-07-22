document.addEventListener('DOMContentLoaded', () => {
    const animalGallery = document.getElementById('animal-gallery');
    const habitatsCardsDiv = document.getElementById('habitats-list');

    // Fonction pour récupérer les animaux d'un habitat
    function fetchAnimals(habitatName) {
        fetch(`/api/animals?habitat=${encodeURIComponent(habitatName)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                animalGallery.innerHTML = ''; // Clear previous results
                
                if (data.length === 0) {
                    animalGallery.innerHTML = '<p>Aucun animal trouvé pour cet habitat.</p>';
                    return;
                }

                data.forEach(animal => {
                    const animalCard = document.createElement('div');
                    animalCard.className = 'col-md-4 mb-4';
                    animalCard.innerHTML = `
                        <div class="card">
                            <img src="/pictures/${animal.url}" class="card-img-top" alt="${animal.nom}">
                            <div class="card-body">
                                <h5 class="card-title">${animal.nom}</h5>
                                <p class="card-text">Santé: ${animal.sante}<br>Poids: ${animal.poids} kg<br>Type de nourriture: ${animal.nourriture}<br>Quantité: ${animal.quantite}</p>
                            </div>
                        </div>
                    `;
                    animalGallery.appendChild(animalCard);
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des animaux:', error);
            });
    }

    // Ajouter des écouteurs d'événements aux cartes d'habitats
    document.querySelectorAll('.ha-card').forEach(card => {
        card.addEventListener('click', () => {
            const habitatName = card.getAttribute('data-habitat');
            fetchAnimals(habitatName);
        });
    });
});
