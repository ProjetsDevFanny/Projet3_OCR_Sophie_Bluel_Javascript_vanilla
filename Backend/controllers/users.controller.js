const db = require("./../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = db.users;

// signup → Inscription d'un utilisateur
exports.signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    // Si email ou mot de passe manquant : erreur 400
    return res.status(400).send({
      message: "Must have email and password",
    });
  }
  try {
    // Hachage sécurisé du mot de passe
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = {
      email: req.body.email,
      password: hash, // le mot de passe n'est pas stocké en clair, il est haché avec bcrypt. Donc même le serveur ne peut pas le lire.
    };
    // Création de l'utilisateur dans la base SQLite
    await Users.create(user);
    // Succès : 201 Created
    return res.status(201).json({ message: "User Created" });
  } catch (err) {
    // Erreur : 500 Internal Server Error
    return res.status(500).send({
      message: err.message,
    });
  }
};
// login → Connexion d'un utilisateur
exports.login = async (req, res) => {
  // Recherche de l'utilisateur par email
  const user = await Users.findOne({ where: { email: req.body.email } });

  if (user === null) {
    // Si l'utilisateur n'est pas trouvé : erreur 404
    return res.status(404).json({ message: "user not found" });
  } else {
    // Vérifie si le mot de passe correspond (comparé au hash)
    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) {
      // Mauvais mot de passe → erreur 401
      return res.status(401).json({ error: new Error("Not Authorized") });
    }
    // Connexion réussie → on génère un token JWT signé
    return res.status(200).json({
      userId: user.id,
      token: jwt.sign(
        { userId: user.id },
        process.env.TOKEN_SECRET, // clé secrète pour signer le token =  doit être défini dans notre.env !
        { expiresIn: "1h" } // durée de validité du token
      ),
    });
  }
};
