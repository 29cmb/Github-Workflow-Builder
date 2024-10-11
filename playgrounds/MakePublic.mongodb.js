use("Projects")
db.getCollection("Projects").updateMany({}, { $set: { public: true } })