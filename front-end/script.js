document.addEventListener('DOMContentLoaded', () => {
    $('#carouselExampleIndicators').carousel({
        interval: 5000, 
        wrap: true     
    });

    $('#carouselReviews').carousel({
        interval: 7000, 
        wrap: true     
    });

    const animalGallery = document.getElementById('animal-gallery');
    const habitatsCardsDiv = document.getElementById('habitats-list');

     // Fonction pour récupérer les animaux d'un habitat
     function fetchAnimals(habitatName) {
        fetch(`http://localhost:3002/api/animals?habitat=${encodeURIComponent(habitatName)}`)
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
                            <img src="/pictures/${animal.url}" class="card-img-top" alt="${animal.nom}">
                            <div class="card-body">
                                <h5 class="card-title">${animal.nom}</h5>
                                <p class="card-text">Santé: ${animal.sante}<br>Poids: ${animal.poids} kg<br>Type de nourriture: ${animal.nourriture}<br>Quantité: ${animal.quantite}</p>
                            </div>
                        </div>
                    `;
                    animalGallery.appendChild(animalCard);
                });

                // Ajouter des écouteurs d'événements pour chaque carte d'animal
                document.querySelectorAll('.animal-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const animalId = card.getAttribute('data-animal-id');
                        fetchAnimalDetails(animalId);
                    });
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des animaux:', error);
            });
    }

    // Fonction pour récupérer les détails d'un animal
    function fetchAnimalDetails(animalId) {
        fetch(`http://localhost:3002/api/animal-details?id=${encodeURIComponent(animalId)}`)
            .then(response => response.json())
            .then(animal => {
                console.log('Animal Details:', animal); 
                const imageUrl = `/pictures/${animal.url}`;
                console.log('Image URL:', imageUrl); 
    
                document.getElementById('modal-body').innerHTML = `
                    <img src="${imageUrl}" class="img-fluid mb-3" alt="${animal.nom}">
                    <h5>${animal.nom}</h5>
                    <p><strong>Santé:</strong> ${animal.sante}</p>
                    <p><strong>Poids:</strong> ${animal.poids} kg</p>
                    <p><strong>Nourriture:</strong> ${animal.nourriture}</p>
                    <p><strong>Quantité:</strong> ${animal.quantite}</p>
                    <p><strong>Description:</strong> ${animal.description}</p>
                `;
                $('#animalModal').modal('show');
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des détails de l\'animal:', error);
            });
    }
    

    // écouteurs d'événements aux cartes d'habitats
    document.querySelectorAll('.ha-card').forEach(card => {
        card.addEventListener('click', () => {
            const habitatName = card.getAttribute('data-habitat');
            fetchAnimals(habitatName);
        });
    });
// Gestion du formulaire de connexion
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault(); // Empêche le formulaire de se soumettre normalement

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Sauvegarder le token dans le stockage local ou les cookies
            localStorage.setItem('token', data.token);
            
            // Redirection vers la page dashboard
            window.location.href = '/dashboard.html';
        } else {
            alert(data.message || 'Erreur de connexion');
        }
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        alert('Erreur serveur');
    }
});
});
