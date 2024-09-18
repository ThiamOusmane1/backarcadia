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
        fetch('https://backarcadia.vercel.app/api/login', {
            method: 'POST',
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
            return fetch('https://backarcadia.vercel.app/api/auth/getUserRole', {
                method: 'GET',
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
        .then(userData => {
            console.log("Rôle de l'utilisateur reçu:", userData.role); // Ajout d'un message de débogage

            // Redirection en fonction du rôle de l'utilisateur
            if (userData.role === 'admin') {
                window.location.href = '/admin-dashboard.html';
            } else if (userData.role === 'vet') {
                window.location.href = '/vet-dashboard.html';
            } else if (userData.role === 'employee') {
                window.location.href = '/employee-dashboard.html';
            }
        })
        .catch(error => {
            console.error('Erreur lors de la connexion:', error);
            alert(error.message || 'Erreur serveur');
        });
    }

    // Attacher le gestionnaire d'événements au formulaire de connexion
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginFormSubmit);
        console.log('Gestionnaire d\'événement attaché au formulaire.'); // Ajout d'un message de débogage
    } else {
        console.error('Le formulaire de connexion est introuvable dans le DOM.');
    }
});
