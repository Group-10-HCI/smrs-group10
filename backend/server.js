const app = require('./app.js');
const connectDB = require('./src/config/db.js');
const env = require('./src/config/env.js');

(async () => {
    await connectDB();
    app.listen(env.PORT, () => {
        console.log(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
    });
})();