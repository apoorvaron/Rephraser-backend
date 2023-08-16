exports.up = async function(db) {
  await db.createTable('corrections', {
    id: { type: 'serial', primaryKey: true },
    user_id: { type: 'integer', notNull: true, foreignKey: {
      name: 'corrections_user_id_fk',
      table: 'users',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      mapping: 'id'
    }},
    original_text: { type: 'text', notNull: true },
    rephrased_text: { type: 'text' },
    created_at: { type: 'timestamp', notNull: true }
  });
};

exports.down = async function(db) {
  await db.dropTable('corrections');
};

exports._meta = {
  version: 1,
};