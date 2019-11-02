module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Transaction', {
    amount: { type: DataTypes.DOUBLE, allowNull: false },
    type : {type:DataTypes.ENUM('credit','debit')}
  }, {underscored: true})

  Model.prototype.toWeb = function () {
    let json = this.toJSON()
    return json
  }

  return Model
}
