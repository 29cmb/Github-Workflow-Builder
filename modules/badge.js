const fs = require("fs");
const path = require("path");
const { makeBadge } = require("badge-maker");

module.exports = {
    users: (db) => {
        setInterval(async () => {
            const users = await db.find({}).toArray();
            const badge = makeBadge({
                label: "users",
                message: users.length.toString(),
                color: "blue"
            });

            const badgesDir = path.join(__dirname, "../badges");
            if (!fs.existsSync(badgesDir)) {
                fs.mkdirSync(badgesDir);
            }

            const badgePath = path.join(badgesDir, "users.svg");
            fs.writeFileSync(badgePath, badge);
        }, 1000 * 60 * 60); // 1 hour
    },
    projects: (db) => {
        setInterval(async () => {
            const users = await db.find({}).toArray();
            const badge = makeBadge({
                label: "projects",
                message: users.length.toString(),
                color: "orange"
            });

            const badgesDir = path.join(__dirname, "../badges");
            if (!fs.existsSync(badgesDir)) {
                fs.mkdirSync(badgesDir);
            }

            const badgePath = path.join(badgesDir, "projects.svg");
            fs.writeFileSync(badgePath, badge);
        }, 1000 * 60 * 60); // 1 hour
    },
    teams: (db) => {
        setInterval(async () => {
            const users = await db.find({}).toArray();
            const badge = makeBadge({
                label: "teams",
                message: users.length.toString(),
                color: "red"
            });

            const badgesDir = path.join(__dirname, "../badges");
            if (!fs.existsSync(badgesDir)) {
                fs.mkdirSync(badgesDir);
            }

            const badgePath = path.join(badgesDir, "teams.svg");
            fs.writeFileSync(badgePath, badge);
        }, 1000 * 60 * 60); // 1 hour
    }
};