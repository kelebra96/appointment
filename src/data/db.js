const mongo = require('mongoose');

const connectionDatabase = () => { 
    mongo.connect(process.env.MONGO_URI)
        .then(() => console.log('Database connected'))
        .catch(err => console.log(err));
}

module.exports = connectionDatabase;