function afficherHistorique(animalId) { 
    // Appelle l'API pour récupérer les données d'historique pour cet animal
    fetch(`http://localhost:3002/api/animals/${animalId}/historique`)  // Correction ici
        .then(response => response.json())
        .then(data => {
            // Affiche les données d'historique dans une modale
            console.log('Historique de l\'animal:', data);

            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = ''; // Vide le contenu précédent
            data.forEach(entry => {
                const historyEntry = document.createElement('p');
                historyEntry.textContent = `Date: ${entry.date}, Détail: ${entry.detail}`;
                modalBody.appendChild(historyEntry);
            });

            // Ouvre la modale (assure-toi d'avoir une modale dans ton HTML)
            $('#animalModal').modal('show');
        })
        .catch(error => console.error('Erreur lors de la récupération de l\'historique :', error));
}


