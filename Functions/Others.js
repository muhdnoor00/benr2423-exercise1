var jwt = require('jsonwebtoken');

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

async function existingusers(client, Username) {
    return await client
        .db('Starting')
        .collection('users')
        .find({ "username": { $eq: Username } })
        .toArray();
}

async function existingsubjects(client, Code) {
    return await client
        .db('Starting')
        .collection('Subjects')
        .find({ "code": { $eq: Code } })
        .toArray();
}

async function existingprograms(client, Code) {
    return await client
        .db('Starting')
        .collection('Programs')
        .find({ "code": { $eq: Code } })
        .toArray();
}

async function existingfaculties(client, Code) {
    return await client
        .db('Starting')
        .collection('Faculty')
        .find({ "code": { $eq: Code } })
        .toArray();
}

async function addStudent(client, code, studentID) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('Subjects');

        const result = await collection.updateOne(
            { code: { $eq: code } },
            { $addToSet: { students: studentID } }
        );

        if (result.matchedCount === 0) {
            // Subject with the given code not found
            return { success: false, message: 'Subject not found' };
        }

        if (result.modifiedCount === 0) {
            // No modifications made (studentID might already be in the list)
            return { success: false, message: 'Student already added' };
        }

        // Successful operation
        return { success: true, message: 'Student added successfully' };
    } catch (error) {
        console.error('Error adding student:', error);
        return { success: false, message: 'Internal Server Error' };
    }
}

async function generateToken(userData) {
    const token = jwt.sign(
        {
            username: userData.username,
            studentID: userData.student_id,
            role: userData.role
        },
        'Holy',
        { expiresIn: '1h' }
    );
    console.log(token);
    return token;
}

async function student(req, res, next) {
    let header = req.headers.authorization;
    if (!header) {
        return res.status(401).send('Unauthorized');
    }

    let token = header.split(' ')[1];

    jwt.verify(token, 'Holy', function (err, decoded) {
        if (err) {
            return res.status(401).send('Unauthorized');
        }
        else {
            console.log(decoded);
            if (decoded.studentID != req.params.student_id) {
                console.log(decoded.studentID, req.params.student_id);
                return res.status(401).send('Your own student ID only');
            }
        }
        next();
    });
}

async function ADMIN(req, res, next) {
    let header = req.headers.authorization;
    if (!header) {
        return res.status(401).send('Unauthorized');
    }

    let token = header.split(' ')[1];

    jwt.verify(token, 'Holy', function (err, decoded) {
        if (err) {
            return res.status(401).send('Unauthorized');
        }
        else {
            console.log(decoded.role)
            if (decoded.role != "Admin") {
                return res.status(401).send('Admin only');
            }
        }
        next();
    });
}

async function second(req, res, next) {
    let header = req.headers.authorization;
    if (!header) {
        return res.status(401).send('Unauthorized');
    }

    let token = header.split(' ')[1];

    jwt.verify(token, 'Holy', function (err, decoded) {
        if (err) {
            return res.status(401).send('Unauthorized');
        }
        else {
            if (decoded.role != "Staff" && decoded.role != "Admin") {
                return res.status(401).send('Admin or Staff only');
            }
            console.log(decoded.role)
        }
        next();
    });
}

module.exports = {
    deleteStudent,
    recordattendance,
    report,
    existingusers,
    existingsubjects,
    existingprograms,
    existingfaculties,
    addStudent,
    generateToken,
    student,
    ADMIN,
    second
};