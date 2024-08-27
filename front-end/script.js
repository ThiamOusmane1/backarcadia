document.addEventListener('DOMContentLoaded', () => {
    // Variables pour le carrousel
    let slideIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        const slidesContainer = document.querySelector('.carousel-slides');
        slideIndex = (index + totalSlides) % totalSlides;
        slidesContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
    }

    document.getElementById('prevButton')?.addEventListener('click', () => {
        showSlide(slideIndex - 1);
    });

    document.getElementById('nextButton')?.addEventListener('click', () => {
        showSlide(slideIndex + 1);
    });

    // Optionnel: faire défiler automatiquement
    setInterval(() => {
        showSlide(slideIndex + 1);
    }, 5000);
    const animalGallery = document.getElementById('animal-gallery');
    //const habitatsCardsDiv = document.getElementById('habitats-list');

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
                animalGallery.innerHTML = ''; 
                
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
