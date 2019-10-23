import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        weight: Sequelize.FLOAT,
        size: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Student;
