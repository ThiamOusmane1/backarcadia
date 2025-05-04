document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://arcadia-back-olive.vercel.app/';// URL de l'API

    // Gestion de la soumission du formulaire de login
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
        fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Indique que le corps de la requête est au format JSON
            },
            body: JSON.stringify({ email, password }) // Envoie les données de login
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur: ${response.status} ${response.statusText}`);
            }
            return response.json(); // Convertit la réponse en JSON
        })
        .then(data => {
            // Stocker le token JWT dans le localStorage
            localStorage.setItem('authToken', data.token);
            console.log("Token JWT reçu:", data.token); // Ajout d'un message de débogage

            // demander le rôle de l'utilisateur avec le token
            return fetch(`${apiUrl}/api/auth/getUserRole`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Envoi du token dans l'en-tête
                }
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur: ${response.status} ${response.statusText}`);
            }
            return response.json(); // Convertit la réponse en JSON
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
