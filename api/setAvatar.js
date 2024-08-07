const { authNeeded } = require("../modules/middleware");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

module.exports = (app) => {
    app.post("/api/v1/user/avatar/set", authNeeded, async (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "No files were uploaded." });
        }

        const avatar = req.files.avatar;
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(avatar.name).toLowerCase());
        const mimetype = allowedTypes.test(avatar.mimetype);

        if (!extname || !mimetype) {
            return res.status(400).json({ message: "Only images of type png, jpg, or gif are allowed." });
        }

        const uploadPath = path.join(__dirname, "../avatars", `${req.session.user}.png`);

        avatar.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).json({ message: "Failed to update avatar." });
            }

            res.status(200).json({ message: "Avatar updated successfully." });
        });
    });

    return {
        method: "POST",
        route: "/api/v1/user/avatar/set"
    };
};