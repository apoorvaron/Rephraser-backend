'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {

  await db.dropTable('corrections');
  await db.removeColumn('users', 'id');
};

exports.down = async function(db) {
  await db.addColumn('users', 'id', {
    type: 'numeric'
  });
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

exports._meta = {
  "version": 1
};
