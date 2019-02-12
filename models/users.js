const connection = require('../db/connection');

exports.fetchAllUsers = () => {
    return connection.select('*').from('users')        
};

exports.findUser = (username) => {
    return connection
        .select('*')
        .from('users')        
        .where(username);
};

exports.insertNewUser = (newUser) => {
    return connection('users')
        .insert(newUser)
        .returning('*');
};

