const db = require('./db.js');
const { projectSchemaVersion } = require("../config/schema.json")
module.exports = {
    migrateProject: async function(pid){
        var project = await db.collections.projects.findOne({ pid });
        if(project == undefined || project == null){
            console.log("❌ | Unable to find project");
            return false
        }

        if(!project.schemaVersion) project.schemaVersion = 1;
        if(project.schemaVersion == projectSchemaVersion){ 
            console.log("❌ | Project is already on the latest schema version");
            return false
        }

        const migrationInstructions = [
            {from: 1, to: 2, func: this.migrateV1ProjectToV2}
        ]

        console.log(`➡️ | Migrating project ${pid} from schema version ${project.schemaVersion} to ${projectSchemaVersion}`);
        const mInstructions = migrationInstructions.find(item => 
            item.from == project.schemaVersion && item.to == projectSchemaVersion
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
    }
}