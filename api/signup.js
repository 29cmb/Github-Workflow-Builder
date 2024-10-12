const db = require("../modules/db.js");
const { hash } = require("../modules/encrypt.js");
const { redirectIfAuth, writeRateLimit } = require("../modules/middleware.js");
const fs = require("fs");
const path = require("path");
const { profileSchemaVersion } = require("../config/schema.json");

module.exports = (app) => {
    app.post("/api/v1/user/signup", redirectIfAuth, writeRateLimit, async (req, res) => {
        const { email, username, password } = req.body;
        if (
            email === undefined ||
            username === undefined ||
            password === undefined ||
            typeof username !== "string" ||
            typeof password !== "string" ||
            typeof email !== "string"
        ) return res.status(400).json({ success: false, message: "Username or password not provided or not formatted properly" });
        if (username.length < 3) return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
        if (password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

        const user = await db.collections.credentials.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });
        if (user) return res.status(400).json({ success: false, message: "Username or email is already taken" });
        const latestUser = await db.collections.credentials.findOne({}, { sort: { uid: -1 } });
        const uid = latestUser ? latestUser.uid + 1 : 1;

        await db.collections.credentials.insertOne({
            email,
            uid,
            username,
            password: hash(password),
        });

        await db.collections.profiles.insertOne({
            uid,
            username,
            bio: "This is a bio.",
            createdAt: Date.now(),
            stars: [],
            profileSchemaVersion
        });

        fs.readdir(path.join(__dirname, "../avatars/default"), (err, files) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error reading avatars directory" });
            }
            
            const randomFile = files[Math.floor(Math.random() * files.length)];
            const sourcePath = path.join(path.join(__dirname, "../avatars/default"), randomFile);
            const targetPath = path.join(path.join(__dirname, "../avatars"), `${uid}.png`);

            fs.copyFile(sourcePath, targetPath, (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error copying avatar file" });
                }
                res.status(200).json({ success: true, message: "You have signed up successfully" });
            });
        });
    });

    return {
        method: "POST",
        route: "/api/v1/user/signup"
    };
};