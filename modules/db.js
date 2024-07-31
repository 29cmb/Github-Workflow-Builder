
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
    client: client,
    databases: {},
    collections: {},
    async run() {
        try {
            await client.connect();

            // assign databases
            this.databases.users = client.db(process.env.USERSDATABASE)
            
            // assign collections
            this.collections.credentials = this.databases.users.collection(process.env.CREDENTIALSCOLLECTION)

            // ping
            await this.databases.users.command({ ping: 1 });
            console.log("🏓 | Pinged the users database!");
        } finally {
            await client.close();
        }
    },
}
