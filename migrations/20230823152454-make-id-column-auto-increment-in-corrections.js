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
  // Remove the existing id column
  await db.removeColumn('corrections', 'id');

  // Rename the pk column to id
  await db.renameColumn('corrections', 'pk', 'id');
};

exports.down = async function(db) {
  // Rename the id column back to pk
  await db.renameColumn('corrections', 'id', 'pk');

  // Recreate the id column with proper attributes
  await db.addColumn('corrections', 'id', {
    type: 'bigint',
    primaryKey: true,
    autoIncrement: true
  });
};

exports._meta = {
  version: 1,
};