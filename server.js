const express = require('express')
    , app = express()
    , cluster = require('cluster')
    , compression = require('compression')
    , cors = require('cors');
const { APP_NAME, PORT } = require('./config/constants');

require('events').EventEmitter.defaultMaxListeners = 0;

if (cluster.isMaster) {
    console.log("Master is running");
    var cpuCores = require("os").cpus().length;
    for (var i = 0; i < cpuCores; i++) {
        let worker = cluster.fork();
        console.log(`Worker ${worker.id} is running`)
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {
        // Replace the dead worker
        console.log(`Worker %d died :(`, worker.id);
        worker = cluster.fork();
        console.log(`New worker ${worker.id} is running`)
    });
} else {
    app.use(cors());
    app.use(compression()); //use compression
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/api', require('./modules/route'));

    try {
        let server = app.listen(PORT, () => console.log(`${APP_NAME} server is starting on ${PORT} port`));
    }
    catch (error) {
        console.log("Failed to start server.");
    }
}