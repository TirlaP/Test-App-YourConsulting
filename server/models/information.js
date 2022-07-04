// Definim tabelul (table) - model

module.exports = (sequelize, DataType) => {
  let model = sequelize.define(
    "Information",
    {
      name: {
        type: DataType.TEXT,
      },
      type: {
        type: DataType.INTEGER,
      },
      liked: {
        type: DataType.BOOLEAN,
      },
    },
    {
      timestamps: true,
    }
  );
  /*
    Aceasta linie este comentata pentru a demonstra legatura dintre tabelul Information si tabelul Post prin id
  */
  // model.belongsTo(sequelize.models.Car, {
  //   foreignKey: "id_car",
  //   onDelete: "cascade",
  // });
  return model;
};
