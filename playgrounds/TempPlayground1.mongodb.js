use("Users")
db.getCollection("Profiles").updateMany({}, { $set: { profileSchemaVersion: 2, schemaVersion: undefined } })
