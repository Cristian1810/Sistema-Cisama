const bcrypt = require('bcrypt');

const password = 'AdminCis843213'; // Cambia por la contraseña que quieras encriptar

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
});
