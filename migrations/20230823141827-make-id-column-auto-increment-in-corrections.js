exports.up = async function(db) {
  await db.runSql(`
    ALTER TABLE corrections
    ALTER COLUMN id SET DEFAULT nextval('corrections_id_seq');
  `);
};

exports.down = async function(db) {
  await db.runSql(`
    ALTER TABLE corrections
    ALTER COLUMN id DROP DEFAULT;
  `);
};

exports._meta = {
  version: 1,
};