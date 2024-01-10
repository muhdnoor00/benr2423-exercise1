//View all student function
async function viewStudentList(client) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('users');

        // Find the user by username
        const user = await collection.find({ role: { $eq: "Student" } }).toArray();

        return user;
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw error;
    }
}

//View student details function by Student ID
async function viewDetails(client, student_id) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('users');
        const user = await collection.findOne({ student_id });
        return user;
    } catch (error) {
        console.error('Error finding user by student_id:', error);
        throw error;
    }
}

module.exports = { viewStudentList, viewDetails };