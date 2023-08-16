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
  await db.createTable('corrections', {
    id: { type: 'bigint', primaryKey: true, autoincrement: true, unique: true },
    user_id: { type: 'bigint', notNull: true, foreignKey: {
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