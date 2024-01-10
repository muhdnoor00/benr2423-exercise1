//Find user function by username
async function findUserByUsername(client, username) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('users');

        // Find the user by username
        const user = await collection.findOne({ username });

        return user;
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw error;
    }
}

//Find student function by Student ID
async function findStudentById(client, StudentId) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('users');

        // Find the user by username
        const user = await collection.findOne({ student_id: StudentId });

        return user;
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw error;
    }
}

module.exports = { findUserByUsername, findStudentById };