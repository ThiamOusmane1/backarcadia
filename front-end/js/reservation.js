document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('reservationForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const nom = document.getElementById('nom').value;
        const email = document.getElementById('email').value;
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;

        if (!nom || !email || !service || !date) {
            alert("Merci de remplir tous les champs obligatoires.");
            return;
        }

        // Simuler envoi
        alert(`Merci ${nom} ! Votre réservation pour "${service}" le ${date} a bien été envoyée.`);

        this.reset();
    });
});
