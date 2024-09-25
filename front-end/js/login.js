document.addEventListener('DOMContentLoaded', () => {

    function handleLoginFormSubmit(event) {
        event.preventDefault(); // Empêcher le comportement par défaut du formulaire

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Vérification basique si les champs ne sont pas vides
        if (!email || !password) {
            console.error("Email ou mot de passe manquant.");
            alert("Veuillez remplir tous les champs.");
            return;
        }

        console.log("Formulaire soumis avec", { email, password }); // Ajout d'un message de débogage

        // Requête pour se connecter et recevoir un token JWT
        fetch('http://localhost:3002/api/login', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Erreur de connexion');
                });
            }
            return response.json();  // Récupérer le token JWT
        })
        .then(data => {
            // Stocker le token JWT dans le localStorage
            localStorage.setItem('authToken', data.token);
            console.log("Token JWT reçu:", data.token); // Ajout d'un message de débogage

            // Ensuite, demander le rôle de l'utilisateur avec le token
            return fetch('http://localhost:3002/api/auth/getUserRole', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,  // Envoi du token dans l'en-tête
                    'Content-Type': 'application/json'
                }
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération du rôle');
            }
            return response.json();
        })
        .then(data => {
            console.log("Rôle de l'utilisateur récupéré:", data.role); // Ajout d'un message de débogage
            // Rediriger l'utilisateur vers la page appropriée en fonction de son rôle
            if (data.role === 'vet') {
                window.location.href = 'vet-dashboard.html';
            } else if (data.role === 'employee') {
                window.location.href = 'employee-dashboard.html';
            } else if (data.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                alert("Rôle d'utilisateur inconnu.");
            }
        })
        .catch(error => {
            console.error('Erreur lors de la connexion:', error);
            alert('Erreur lors de la connexion: ' + error.message);
        });
    }

    // Ajouter l'événement de soumission au formulaire
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLoginFormSubmit);
});
