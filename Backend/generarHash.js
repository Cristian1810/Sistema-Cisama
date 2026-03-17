const bcrypt = require('bcrypt');

const nuevaContrasena = 'AdminCis843213'; // Cambia esto por la contraseña deseada

bcrypt.hash(nuevaContrasena, 10).then(hash => {
});
