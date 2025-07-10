module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "users", // nom de la table
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false, // l'email est obligatoire
        unique: true, // l'email est unique
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, // le mot de passe est obligatoire
      },
    },
    { timestamps: false } // pas de colonnes createdAt/updatedAt créées automatiquement
  );
  return Users;
};
