// Definim tabelul (table) - model

module.exports = (sequelize, DataType) => {
  let model = sequelize.define(
    "Junction",
    {
      id_car: {
        type: DataType.INTEGER,
        foreignKey: true,
      },
      id_person: {
        type: DataType.INTEGER,
        foreignKey: true,
      },
    },
    {
      timestamps: true,
    }
  );
  /*
      Aceasta linie este comentata pentru a demonstra legatura dintre tabelul Information si tabelul Post prin id
    */
  //wtf is this -.-
  // la ce te referi?
  // ce ai scris aici e o prostie :))
  // ai facut din Person in Car si din Car in Person xD
  // foloseste codul asta si o sa-ti dai seama unde-i greseala :D

  // gotcha Spor !
  // Thanks!

  // model.belongsTo(sequelize.models.Car, {
  //   foreignKey: "id_car",
  //   onDelete: "cascade",
  // });
  model.belongsTo(sequelize.models.Car, {
    foreignKey: "id_car",
    onDelete: "cascade",
  });
  model.belongsTo(sequelize.models.Person, {
    foreignKey: "id_person",
    onDelete: "cascade",
  });
  return model;
};
