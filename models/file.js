module.exports = (sequelize, DataTypes) => {
    return sequelize.define('File', {
      name: { 
        type: DataTypes.STRING,
         allowNull: false 
        },
      filename: {
         type: DataTypes.STRING,
          allowNull: false 
        },
      image: {
         type: DataTypes.BLOB, 
         allowNull: false
         },
      upload_date: {
         type: DataTypes.DATE,
          defaultValue: DataTypes.NOW 
        },
      modified_date: {
         type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      tableName: 'files',
      timestamps: false,
    });
  };
  