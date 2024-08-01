
const { MongoClient, ServerApiVersion } = require('mongodb');
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
            this.databases.users = client.db(process.env.USERSDATABASE)
            this.databases.projects = client.db(process.env.PROJECTSDATABASE)
            this.databases.teams = client.db(process.env.TEAMSDATABASE)
            
            // assign collections
            this.collections.credentials = this.databases.users.collection(process.env.CREDENTIALSCOLLECTION)
            this.collections.sessions = this.databases.users.collection(process.env.SESSIONSCOLLECTION)
            this.collections.projects = this.databases.projects.collection(process.env.PROJECTSCOLLECTION)
            this.collections.teams = this.databases.teams.collection(process.env.TEAMSCOLLECTION)
            this.collections.profiles = this.databases.users.collection(process.env.PROFILESCOLLECTION)

            // ping
            await this.databases.users.command({ ping: 1 });
            console.log("🏓 | Pinged the users database!");
        } finally {
            await client.close();
        }
    },
}
