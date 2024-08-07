const multer = require("multer");
const { authNeeded } = require("../modules/middleware");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../avatars"));
    },
    filename: (req, file, cb) => {
        cb(null, `${req.session.user}.png`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only images of type png, jpg, or gif are allowed."));
        }
    }
}).single('avatar');

module.exports = (app) => {
    app.post("/api/v1/user/avatar/set", authNeeded, (req, res) => {
        upload(req, res, (err) => {
            console.log("Got avatar request");
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ success: false, message: "No files were uploaded." });
            }

            res.status(200).json({ success: true, message: "Avatar updated successfully." });
        });
    });

    return {
        method: "POST",
        route: "/api/v1/user/avatar/set"
    };
};