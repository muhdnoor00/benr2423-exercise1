var jwt = require('jsonwebtoken');

//Delete student function by Student ID
async function deleteStudent(client, studentID) {
    try {
        const database = client.db('AttendanceSystem');
        const collection = database.collection('Users');

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
        const database = client.db('AttendanceSystem');
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
        const database = client.db('AttendanceSystem');
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
        .db('AttendanceSystem')
        .collection('Users')
        .find({ "username": { $eq: Username } })
        .toArray();
}

async function existingsubjects(client, Code) {
    return await client
        .db('AttendanceSystem')
        .collection('Subjects')
        .find({ "code": { $eq: Code } })
        .toArray();
}

async function existingprograms(client, Code) {
    return await client
        .db('AttendanceSystem')
        .collection('Programs')
        .find({ "code": { $eq: Code } })
        .toArray();
}

async function existingfaculties(client, Code) {
    return await client
        .db('AttendanceSystem')
        .collection('Faculty')
        .find({ "code": { $eq: Code } })
        .toArray();
}

async function addStudent(client, code, studentIDs) {
    try {
        const database = client.db('AttendanceSystem');
        const collection = database.collection('Subjects');

        const result = await collection.updateOne(
            { code: code },
            { $addToSet: { student_id: { $each: studentIDs } } }
        );

        const updatedDocument = await collection.findOne({ code });
        console.log("Updated Document:", updatedDocument);
        return result;
    } catch (error) {
        console.error("Error adding students:", error);
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

async function STUDENT(req, res, next) {
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
            if (decoded.role != "Student") {
                return res.status(401).send('Student only');
            }
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

async function FACULTY(req, res, next) {
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
            if (decoded.role != "staff") {
                console.log(decoded.role);
                return res.status(401).send('Faculty Level Only');
            }
        }
        next();
    });
}

async function FACULTYSTUDENT(req, res, next) {
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
            if (decoded.role != "staff" && decoded.role != "Student") {
                console.log(decoded.role);
                return res.status(401).send('Faculty and Student Access Only');
            }
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
    ADMIN,
    STUDENT,
    FACULTY,
    FACULTYSTUDENT
};