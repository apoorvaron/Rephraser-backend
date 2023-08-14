exports.up = async function(db) {
  await db.changeColumn('users', 'id', {
    type: 'Numeric',
    sequence: {
      name: 'users_id_seq',
    },
    notNull: true,
    primaryKey: true,
  });
};

exports.down = async function(db) {
  await db.changeColumn('users', 'id', {
    type: 'text', 
    notNull: true,
    primaryKey: true,
  });
};

exports._meta = {
"version": 1
};