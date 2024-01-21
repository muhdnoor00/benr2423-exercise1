//View all student function
async function viewStudentList(client) {
    try {
        const database = client.db('AttendanceSystem');
        const collection = database.collection('Users');

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
        const database = client.db('AttendanceSystem');
        const usersCollection = database.collection('Users');
        const facultiesCollection = database.collection('Faculties');
        const programsCollection = database.collection('Programs');
        const subjectsCollection = database.collection('Subjects');

        const user = await usersCollection.findOne({ student_id });
        if (!user) {
            return null; // Student not found
        }

        const facultyDetails = await facultiesCollection.findOne({ "students.student_id": student_id });
        const programDetails = await programsCollection.findOne({ "students.student_id": student_id });

        // Aggregation pipeline for the Subjects collection
        const aggregationPipelineSubjects = [
            {
                $unwind: "$student_id"
            },
            {
                $project: {
                    _id: 0,
                    name: "$name",
                    code: "$code",
                    credit: "$credit"
                }
            }
        ];

        const subjectDetails = await subjectsCollection.aggregate(aggregationPipelineSubjects).toArray();


        console.log(user);
        console.log(subjectDetails);
        console.log(facultyDetails);
        console.log(programDetails);

        if (!facultyDetails || !programDetails || !subjectDetails) {
            return null; // Additional details not found
        }

        // Extract relevant details from the retrieved documents
        const mergedDetails = {
            username: user.username,
            student_id: user.student_id,
            email: user.email,
            role: user.role,
            phone: user.phone,
            PA: user.PA,
            faculty: facultyDetails.name,
            program: {
                name: programDetails.name,
                code: programDetails.code,
            },
            subjects: subjectDetails.map(subject => ({
                name: subject.name || null,
                code: subject.code || null,
                credit: subject.credit || null
            }))
        };

        return mergedDetails;
    } catch (error) {
        console.error('Error retrieving user details:', error);
        throw error;
    }
}

module.exports = { viewStudentList, viewDetails };