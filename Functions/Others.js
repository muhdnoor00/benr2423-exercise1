const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022210217:Meg04fEK7vmuXK0h@class0.qzwsbgr.mongodb.net/?retryWrites=true&w=majority";

//Delete student function by Student ID
async function deleteStudent(client, studentID) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('users');

        const result = await collection.deleteOne({ student_id: studentID });

        return result;
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
}

//Record attendance function by Student ID
async function recordattendance(client, StudentId, Date, Status) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('Attendance');

        // Create a user object
        const attendance = {
            student_id: StudentId,
            date: Date,
            status: Status
        };
        // Insert the user object into the collection
        await collection.insertOne(attendance);

        console.log("Attendance recorded successfully");
    } catch (error) {
        console.error("Error recording attendance:", error);
    }
}

//Report attendance function by Student ID
async function report(client, StudentId) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('Attendance');
        const user = await collection.find({ student_id: StudentId }).toArray();
        return user;
    } catch (error) {
        console.error('Error finding user by student_id:', error);
        throw error;
    }
}

module.exports = { deleteStudent, recordattendance, report };