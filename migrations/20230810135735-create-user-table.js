exports.up = async function(db) {
  await db.createTable('users', {
    id: { type: 'serial', primaryKey: true },
    username: { type: 'string', notNull: true },
    password: { type: 'string', notNull: true },
    created_at: { type: 'timestamp', notNull: true },
    updated_at: { type: 'timestamp', notNull: true },
  });
};

exports.down = async function(db) {
 await db.dropTable('users');
};

exports._meta = {
"version": 1
};