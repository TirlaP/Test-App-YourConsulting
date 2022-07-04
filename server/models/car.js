module.exports = (sequelize, DataType) => {
  let model = sequelize.define(
    "Car",
    {
      marca: {
        type: DataType.TEXT,
      },
      model: {
        type: DataType.TEXT,
      },
      fabricatie: {
        type: DataType.INTEGER,
      },
      capacitate: {
        type: DataType.INTEGER,
      },
      taxa: {
        type: DataType.INTEGER,
      },
    },
    {
      timestamps: true,
    }
  );

  // model.belongsTo(sequelize.models.Post, {foreignKey: 'id_post', onDelete: 'set null'});
  return model;
};
