const db = require('./db.js');
const { projectSchemaVersion, profileSchemaVersion } = require("../config/schema.json");
const { decrypt, hash } = require('./encrypt.js');

module.exports = {
    migrateProject: async function(pid) {
        var project = await db.collections.projects.findOne({ pid });
        if (project == undefined || project == null) {
            console.log("❌ | Unable to find project");
            return false;
        }

        if (!project.projectSchemaVersion) project.projectSchemaVersion = 1;
        if (project.projectSchemaVersion == projectSchemaVersion) {
            console.log("❌ | Project is already on the latest schema version");
            return false;
        }

        const migrationInstructions = [
            {from: 1, to: 2, func: this.migrateV1ProjectToV2}
        ]

        console.log(`➡️ | Migrating project ${pid} from schema version ${project.projectSchemaVersion} to ${projectSchemaVersion}`);
        const mInstructions = migrationInstructions.find(item => 
            item.from == project.projectSchemaVersion && item.to == projectSchemaVersion
        );
        
        if(!mInstructions){
            console.log("❌ | Unable to find migration instructions");
            return false;
        }

        await mInstructions.func(pid);
    },
    migrateV1ProjectToV2: async function(pid){
        var project = await db.collections.projects.findOne({ pid });
        if(project == undefined || project == null) return false;

        await db.collections.projects.updateOne({ pid }, { $set: { 
            projectSchemaVersion,
            createdAt: Date.now(),
            forks: 0,
            stars: 0
        }});
    },
    migrateUser: async function(uid){ 
        var user = await db.collections.profiles.findOne({ uid });
        if (user == undefined || user == null) {
            console.log("❌ | Unable to find project");
            return false;
        }

        if (!user.profileSchemaVersion) user.profileSchemaVersion = 1;
        if (user.profileSchemaVersion == projectSchemaVersion) {
            console.log("❌ | Project is already on the latest schema version");
            return false;
        }

        const migrationInstructions = [
            {from: 1, to: 2, func: this.migrateV1UserToV2}
        ]
        console.log(`➡️ | Migrating user ${uid} from schema version ${user.profileSchemaVersion} to ${profileSchemaVersion}`);
        const mInstructions = migrationInstructions.find(item => 
            item.from == user.profileSchemaVersion && item.to == profileSchemaVersion
        );
        
        if(!mInstructions){
            console.log("❌ | Unable to find migration instructions");
            return false;
        }

        await mInstructions.func(uid);
    },
    migrateV1UserToV2: async function(uid){
        var user = await db.collections.profiles.findOne({ uid });
        var credentials = await db.collections.credentials.findOne({ uid });
        if (user == undefined || user == null || credentials == undefined || credentials == null) return false;

        var password = decrypt(credentials.password);
        await db.collections.credentials.updateOne({ uid }, { $set: {
            password: hash(password)
        }});

        await db.collections.profiles.updateOne({ uid }, { $set: {
            createdAt: Date.now(),
            stars: [],
            profileSchemaVersion
        }});
    }
};