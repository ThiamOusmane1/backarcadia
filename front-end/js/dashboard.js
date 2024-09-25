document.addEventListener('DOMContentLoaded', () => { 
    fetch('http://localhost:3002/api/dashboard-data', {
        method: 'GET',
        credentials: 'include' // Pour envoyer les cookies de session
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const dashboardTitle = document.getElementById('dashboardTitle');

        if (data.role === 'vet') {
            dashboardTitle.innerText = 'Tableau de Bord Vétérinaire';
            displayVetDashboard(data.habitats);
            document.getElementById('vetContainer').style.display = 'block';
        } else if (data.role === 'employee') {
            dashboardTitle.innerText = 'Tableau de Bord Employé';
            displayEmployeeDashboard(data.reviews);
            document.getElementById('employeeContainer').style.display = 'block';
        } else if (data.role === 'admin') {
            dashboardTitle.innerText = 'Tableau de Bord Admin';
            displayAdminDashboard(data.habitats, data.reviews);
            document.getElementById('adminContainer').style.display = 'block';
        } else {
            document.getElementById('dashboardContent').innerHTML = '<p>Rôle non reconnu.</p>';
        }
    })
    .catch(error => {
        console.error('Erreur lors du chargement du tableau de bord:', error);
        alert('Erreur lors du chargement du tableau de bord');
    });

    // Fonction pour afficher le tableau de bord vétérinaire
    function displayVetDashboard(habitats) {
        const habitatsContainer = document.getElementById('habitatsContainer');
        let html = '';

        habitats.forEach(habitat => {
            html += `<h3>${habitat.nom}</h3>`;
            html += '<ul>';
            
            habitat.animals.forEach(animal => {
                html += `<li>
                    <span>${animal.nom} - Santé : ${animal.sante} - Poids : ${animal.poids}kg</span>
                    <button onclick="editAnimal('${animal._id}')">Modifier</button>
                </li>`;
            });

            html += '</ul>';
        });

        habitatsContainer.innerHTML = html;
    }

    // Fonction pour afficher le tableau de bord employé
    function displayEmployeeDashboard(reviews) {
        const reviewsContainer = document.getElementById('reviewsContainer');
        let html = '';

        reviews.forEach(review => {
            html += `<div>
                <p>${review.commentaire} - Note : ${review.note}/5</p>
                <button onclick="replyToReview('${review._id}')">Répondre</button>
            </div>`;
        });

        reviewsContainer.innerHTML = html;
    }

    // Fonction pour afficher le tableau de bord admin
    function displayAdminDashboard(habitats, reviews) {
        displayVetDashboard(habitats); // Admin voit les habitats et animaux
        displayEmployeeDashboard(reviews); // Admin voit aussi les avis
    }

    // Fonction pour répondre à un avis
    function replyToReview(reviewId) {
        document.getElementById('replyForm').style.display = 'block';

        const replyForm = document.getElementById('replyToReviewForm');
        replyForm.onsubmit = function(event) {
            event.preventDefault();
            const response = document.getElementById('response').value;
            fetch(`http://localhost:3002/api/reviews/${reviewId}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ response })
            })
            .then(response => response.json())
            .then(data => {
                alert('Réponse envoyée avec succès');
                location.reload();
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi de la réponse :', error);
                alert('Erreur lors de l\'envoi de la réponse');
            });
        };
    }

    // Fonction pour éditer un animal (vétérinaire/admin)
    function editAnimal(animalId) {
        fetch(`http://localhost:3002/api/animals/${animalId}`)
            .then(response => response.json())
            .then(animal => {
                const editForm = `
                    <div id="editAnimalForm">
                        <h3>Modifier ${animal.nom}</h3>
                        <form onsubmit="submitAnimalEdit(event, '${animalId}')">
                            <label for="nom">Nom :</label>
                            <input type="text" id="nom" name="nom" value="${animal.nom}">
                            
                            <label for="sante">Santé :</label>
                            <input type="text" id="sante" name="sante" value="${animal.sante}">
                            
                            <label for="poids">Poids :</label>
                            <input type="number" id="poids" name="poids" value="${animal.poids}">
                            
                            <button type="submit">Enregistrer les modifications</button>
                        </form>
                    </div>`;
                document.getElementById('dashboardContent').insertAdjacentHTML('beforeend', editForm);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des détails de l\'animal :', error);
            });
    }

    function submitAnimalEdit(event, animalId) {
        event.preventDefault();

        const nom = document.getElementById('nom').value;
        const sante = document.getElementById('sante').value;
        const poids = document.getElementById('poids').value;

        fetch(`http://localhost:3002/api/animals/${animalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nom, sante, poids })
        })
        .then(response => response.json())
        .then(data => {
            alert('Animal mis à jour avec succès');
            location.reload();
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour de l\'animal :', error);
            alert('Erreur lors de la mise à jour');
        });
    }
});


