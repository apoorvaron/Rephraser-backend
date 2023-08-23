'use strict';

var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  await db.runSql(`
    CREATE SEQUENCE corrections_id_seq;
    ALTER TABLE corrections
    ALTER COLUMN id SET DEFAULT nextval('corrections_id_seq');
  `);
};

exports.down = async function(db) {
  await db.runSql(`
    ALTER TABLE corrections
    ALTER COLUMN id DROP DEFAULT;
    DROP SEQUENCE corrections_id_seq;
  `);
};

exports._meta = {
  version: 1,
};