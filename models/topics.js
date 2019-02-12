const connection = require('../db/connection');

exports.fetchAllTopics = () => {
    return connection.select('*').from('topics')        
};

exports.insertNewTopic = (newTopic) => {
    return connection('topics')
        .insert(newTopic)
        .returning('*');
};

