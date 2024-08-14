const path = require("path");
const fs = require("fs");

module.exports = (app) => {
    app.get("/api/v1/user/:uid/pfp", async (req, res) => {
        const { uid } = req.params;
        const avatarsDir = path.join(__dirname, "../avatars");

        try {
            const files = await fs.promises.readdir(avatarsDir);
            const profilePicture = files.find(file => file.startsWith(uid + "."));

            if (!profilePicture) {
                return res.status(404).json({ success: false, message: "Profile picture not found." });
            }

            const filePath = path.join(avatarsDir, profilePicture);
            res.sendFile(filePath, (err) => {
                if (err) {
                    res.status(500).json({ success: false, message: "Internal server error." });
                }
            });
        } catch (err) {
            res.status(500).json({ success: false, message: "Internal server error." });
            console.log(err)
        }
    });

    return {
        method: "GET",
        route: "/api/v1/user/:uid/pfp"
    }
}