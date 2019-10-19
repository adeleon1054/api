// ensure correct server.js file for the migration script
const path = require("path");

const server = require(path.resolve(__dirname, "../../server.js"));
const { mysqlDb } = server.datasources;

const models = [
  "User",
  "AccessToken",
  "ACL",
  "RoleMapping",
  "Role",
  "Client",
  "Widget"
];

module.exports = function migrateBaseModels(app, next) {
  console.log("\n---\nBeginning Migrations...");

  // are models in sync with DB?
  mysqlDb.isActual(models, (err, actual) => {
    if (err) throw err;

    const syncStatus = actual ? "in sync" : "out of sync";

    console.log("\nModels are ${syncStatus}");

    if (actual) return next();

    console.log("Migrating Models...");

    // create the tables for us and/or migrates them with new properties
    return mysqlDb.autoupdate(models, err => {
      if (err) throw err;

      console.log("Models migration successful!\n");

      next();
    });
  });
};
