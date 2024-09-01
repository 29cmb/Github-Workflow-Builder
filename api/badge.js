const path = require('path');
const fs = require('fs');

module.exports = (app) => {
    app.get('/badges/:badge', (req, res) => {
        const badgeName = req.params.badge;
        const badgePath = path.join(__dirname, '../badges', badgeName);

        if (fs.existsSync(badgePath)) {
            fs.readFile(badgePath, 'utf8', (err, data) => {
                if (err) {
                    res.status(500).send('Error reading badge file');
                } else {
                    res.setHeader('Content-Type', 'image/svg+xml');
                    res.send(data);
                }
            });
        } else {
            res.status(404).send('Badge not found');
        }
    });

    return {
        method: 'GET',
        route: '/badges/:badgeName'
    };
};