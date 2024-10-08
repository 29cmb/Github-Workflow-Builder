
const { MongoClient, ServerApiVersion } = require('mongodb');
const logging = require("../config/logging.json")
const badge = require("./badge.js")
const uri = `mongodb+srv://${process.env.DATABASEUSER}:${process.env.DATABASEPASS}@${process.env.DATABASEURI}/?retryWrites=true&w=majority&appName=${process.env.DATABASEAPPNAME}`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = {
    uri,
    client,
    databases: {},
    collections: {},
    async init() {
      try {
          await client.connect();

          // assign databases
          this.databases.users = client.db(process.env.USERSDATABASE);
          this.databases.projects = client.db(process.env.PROJECTSDATABASE);
          this.databases.teams = client.db(process.env.TEAMSDATABASE);
          
          // assign collections
          this.collections.credentials = this.databases.users.collection(process.env.CREDENTIALSCOLLECTION);
          this.collections.sessions = this.databases.users.collection(process.env.SESSIONSCOLLECTION);
          this.collections.projects = this.databases.projects.collection(process.env.PROJECTSCOLLECTION);
          this.collections.teams = this.databases.teams.collection(process.env.TEAMSCOLLECTION);
          this.collections.profiles = this.databases.users.collection(process.env.PROFILESCOLLECTION);
          this.collections.invites = this.databases.teams.collection(process.env.INVITESCOLLECTION);

          // ping
          await this.databases.users.command({ ping: 1 });
          if(logging.logDatabaseSetup) console.log("🏓 | Pinged the users database!");
          await this.databases.projects.command({ ping: 1 });
          if(logging.logDatabaseSetup) console.log("🏓 | Pinged the projects database!");
          await this.databases.teams.command({ ping: 1 });
          if(logging.logDatabaseSetup){ 
            console.log("🏓 | Pinged the teams database!") 
            console.log("🎉 | All databases have been pinged and are online!") 
          }
          badge.users(this.collections.profiles)
          badge.projects(this.collections.projects)
          badge.teams(this.collections.teams)
      } catch (error) {
          console.log("❌ | Failed to initialize database connections:", error);
      }
    }
}
