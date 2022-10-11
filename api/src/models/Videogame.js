const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('videogame', {
    id:{
      type: DataTypes.INTEGER,
      autoincrement: true,
      primatyKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description:{
      type: DataTypes.STRING,
      allowNull: false
    },
    launch_date:{
      type: DataTypes.DATEONLY,
    },
    rating:{
      type: DataTypes.INTEGER,
    },
    available_platforms:{

    }
  });
};
