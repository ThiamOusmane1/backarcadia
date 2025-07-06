/**
 * Filtre les champs autorisés dans un objet avec options avancées
 * @param {Object} input - L'objet à filtrer
 * @param {Array} allowedFields - Liste des champs autorisés
 * @param {Object} options - Options de filtrage
 * @param {boolean} options.sanitize - Nettoie automatiquement les chaînes (défaut: false)
 * @param {Array} options.required - Liste des champs obligatoires (défaut: [])
 * @returns {Object} - Objet filtré
 * @throws {Error} - Si des champs requis sont manquants
 */
function filterFields(input, allowedFields, options = {}) {
    const { sanitize = false, required = [] } = options;
    
    if (!input || typeof input !== 'object') {
        throw new Error('Input doit être un objet');
    }
    
    if (!Array.isArray(allowedFields)) {
        throw new Error('allowedFields doit être un tableau');
    }
    
    const filtered = Object.fromEntries(
        Object.entries(input).filter(([key, value]) => {
            // Vérifier si le champ est autorisé
            if (!allowedFields.includes(key)) return false;
            
            // Filtrer les valeurs vides
            if (value === undefined || value === null) return false;
            
            // Nettoyer les chaînes si demandé
            if (sanitize && typeof value === 'string') {
                input[key] = value.trim();
            }
            
            return true;
        })
    );
    
    // Vérification des champs requis
    if (required.length > 0) {
        const missing = required.filter(field => !filtered.hasOwnProperty(field));
        if (missing.length > 0) {
            throw new Error(`Champs manquants: ${missing.join(', ')}`);
        }
    }
    
    return filtered;
}

/**
 * Valide un email avec une regex simple
 * @param {string} email - L'email à valider
 * @returns {boolean} - True si l'email est valide
 */
function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
}

/**
 * Valide un mot de passe (minimum 8 caractères)
 * @param {string} password - Le mot de passe à valider
 * @returns {boolean} - True si le mot de passe est valide
 */
function isValidPassword(password) {
    return password && typeof password === 'string' && password.length >= 8;
}

/**
 * Nettoie une chaîne de caractères (supprime les espaces en début/fin)
 * @param {any} str - La valeur à nettoyer
 * @returns {any} - La chaîne nettoyée ou la valeur originale
 */
function sanitizeString(str) {
    return typeof str === 'string' ? str.trim() : str;
}

/**
 * Valide un nom (non vide et uniquement lettres, espaces, tirets)
 * @param {string} name - Le nom à valider
 * @returns {boolean} - True si le nom est valide
 */
function isValidName(name) {
    if (!name || typeof name !== 'string') return false;
    const regex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    return regex.test(name.trim()) && name.trim().length >= 2;
}

/**
 * Valide un rôle parmi une liste prédéfinie
 * @param {string} role - Le rôle à valider
 * @param {Array} allowedRoles - Liste des rôles autorisés (défaut: ['user', 'admin'])
 * @returns {boolean} - True si le rôle est valide
 */
function isValidRole(role, allowedRoles = ['user', 'admin']) {
    return allowedRoles.includes(role);
}

/**
 * Nettoie et valide un objet utilisateur complet
 * @param {Object} userData - Les données utilisateur
 * @param {Object} options - Options de validation
 * @returns {Object} - Objet nettoyé et validé
 * @throws {Error} - Si les données ne sont pas valides
 */
function sanitizeUserData(userData, options = {}) {
    const { 
        allowedFields = ['nom', 'email', 'role', 'password'],
        required = ['nom', 'email'],
        allowedRoles = ['user', 'admin']
    } = options;
    
    // Filtrer les champs autorisés
    const filtered = filterFields(userData, allowedFields, {
        sanitize: true,
        required: required
    });
    
    // Validations spécifiques
    if (filtered.email && !isValidEmail(filtered.email)) {
        throw new Error('Email invalide');
    }
    
    if (filtered.password && !isValidPassword(filtered.password)) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    if (filtered.nom && !isValidName(filtered.nom)) {
        throw new Error('Le nom doit contenir au moins 2 caractères et uniquement des lettres');
    }
    
    if (filtered.role && !isValidRole(filtered.role, allowedRoles)) {
        throw new Error(`Le rôle doit être parmi: ${allowedRoles.join(', ')}`);
    }
    
    return filtered;
}

module.exports = {
    filterFields,
    isValidEmail,
    isValidPassword,
    sanitizeString,
    isValidName,
    isValidRole,
    sanitizeUserData
};