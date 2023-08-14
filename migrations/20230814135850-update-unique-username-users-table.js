exports.up = async function (db) {
  await db.changeColumn('users', 'id', {
    type: 'numeric',
    sequence: {
      name: 'users_id_seq',
    },
    notNull: true,
    primaryKey: true,
  });

  // Add a unique index to the username column
  await db.addIndex('users', 'users_username_idx', ['username'], true);
};

exports.down = async function (db) {
  // Remove the unique index first
  await db.removeIndex('users', 'users_username_idx');

  await db.changeColumn('users', 'id', {
    type: 'text',
    notNull: true,
    primaryKey: true,
  });
};

exports._meta = {
  version: 2,
};
