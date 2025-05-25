const { User, sequelize } = require('../models');

exports.findAll        = () => User.findAll();
exports.findById       = id => User.findByPk(id);
exports.findByUsername = username => User.findOne({ where: { username } });

exports.create = async dto => {
  const t = await sequelize.transaction();
  try {
    // жодного хешування: пароль записуємо «як є»
    const user = await User.create(
      { ...dto, role: dto.role || 'user' },
      { transaction: t }
    );
    await t.commit();
    return user;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

exports.update = async (id, dto) => {
  const t = await sequelize.transaction();
  try {
    const user = await User.findByPk(id, { transaction: t });
    if (!user) throw new Error('User not found');

    // якщо пароль не передано — не змінюємо
    if (!dto.password) delete dto.password;

    await user.update(dto, { transaction: t });
    await t.commit();
    return user;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

exports.delete = async id => {
  const t = await sequelize.transaction();
  try {
    const user = await User.findByPk(id, { transaction: t });
    if (!user) throw new Error('Nothing to delete');

    await user.destroy({ transaction: t });
    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
