const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022210217:Meg04fEK7vmuXK0h@class0.qzwsbgr.mongodb.net/?retryWrites=true&w=majority";

const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const create = require('./Functions/Create.js');
const view = require('./Functions/View.js');
const find = require('./Functions/Find.js');
const others = require('./Functions/Others.js');

app.use(express.json())
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Use bodyParser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., HTML, CSS)
app.use(express.static('public'));

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

// Define a route for the login form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/login', async (req, res) => {
    console.log('Request received for /login');
    const { username, password } = req.body;

    try {
        console.log('Attempting to find user by username:', username);
        const user = await find.findUserByUsername(client, username);

        if (!user) {
            console.log('User not found:', username);
            return res.status(401).send('Invalid username or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            console.log('Login successful for user:', username);
            const token = await generateToken(user);
            res.send('Login Succesful, your token is \n' + token);
            /*if (user.role == "Admin") {
                const token = await generateToken(user);
                res.send('Login Succesful, your token is \n' + token);
                //return res.sendFile(__dirname + '/public/admin.html');
            }
            else if (user.role == "Student") {
                const token = await generateToken(user);
                res.send('Login Succesful, your token is \n' + token);
                //return res.sendFile(__dirname + '/public/student.html');
            }
            else {
                const token = await generateToken(user);
                res.send('Login Succesful, your token is \n' + token);
                //return res.sendFile(__dirname + '/public/faculty.html');
            }*/

        } else {
            console.log('Incorrect password for user:', username);
            res.status(401).send('Invalid username or password');
        }
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/admin/create-user/students', ADMIN, async (req, res) => {
    try {
        const { username, password, student_id, email, phone, PA } = req.body;

        // Check if the username already exists
        const existingUser = await existing(username);

        if (existingUser.length > 0) {
            // If a user with the same username already exists, return a 400 response
            console.log(existingUser);
            return res.status(400).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // If the username is unique, proceed to create the new student
        create.createStudent(client, username, hashedPassword, student_id, email, phone, PA);
        return res.status(201).send("User created successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}
);

app.post('/admin/create-user/staff', ADMIN, async (req, res) => {
    try {
        const { username, password, staff_id, email, phone } = req.body;

        // Check if the username already exists
        const existingUser = await existing(username);

        if (existingUser.length > 0) {
            // If a user with the same username already exists, return a 400 response
            console.log(existingUser);
            return res.status(400).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // If the username is unique, proceed to create the new student
        create.createStaff(client, username, hashedPassword, staff_id, email, phone);
        return res.status(201).send("User created successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}
);

app.post('/create-user/admin', async (req, res) => {
    try {
        const { username, password, email, phone } = req.body;

        // Check if the username already exists
        const existingUser = await existing(username);

        if (existingUser.length > 0) {
            // If a user with the same username already exists, return a 400 response
            console.log(existingUser);
            return res.status(400).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // If the username is unique, proceed to create the new student
        create.createAdmin(client, username, hashedPassword, email, phone);
        return res.status(201).send("User created successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}
);

app.post('/faculty/create-subject', second, async (req, res) => {
    try {
        const { name, code, credit, faculty, program, session, students } = req.body;

        // Check if the username already exists
        const existingSubject = await client
            .db('Starting')
            .collection('Subjects')
            .find({ "code": { $eq: code } })
            .toArray();

        if (existingSubject.length > 0) {
            // If a user with the same username already exists, return a 400 response
            console.log(existingSubject);
            return res.status(400).send('Subject already exists');
        }

        // If the username is unique, proceed to create the new student
        create.createSubject(client, name, code, credit, faculty, program, session, students);
        return res.status(201).send("Subject created successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post('/faculty/create-program', second, async (req, res) => {
    try {
        const { name, code, faculty, subject, students, session } = req.body;

        // Check if the username already exists
        const existingProgram = await client
            .db('Starting')
            .collection('Programs')
            .find({ "code": { $eq: code } })
            .toArray();

        if (existingProgram.length > 0) {
            // If a user with the same username already exists, return a 400 response
            console.log(existingProgram);
            return res.status(400).send('Program already exists');
        }

        // If the username is unique, proceed to create the new student
        create.createPrograms(client, name, code, faculty, subject, students, session);
        return res.status(201).send("Program created successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post('/admin/create-faculty', ADMIN, async (req, res) => {
    try {
        const { name, code, program, students, session } = req.body;

        // Check if the username already exists
        const existingFaculty = await client
            .db('Starting')
            .collection('Faculties')
            .find({ "code": { $eq: code } })
            .toArray();

        if (existingFaculty.length > 0) {
            // If a user with the same username already exists, return a 400 response
            console.log(existingFaculty);
            return res.status(400).send('Faculty already exists');
        }

        // If the username is unique, proceed to create the new student
        create.createFaculty(client, name, code, program, students, session);
        return res.status(201).send("Faculty created successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post('/students/record', (req, res) => {
    const { student_id, date, status } = req.body;

    try {
        others.recordattendance(client, student_id, date, status);
        return res.status(201).send("Attendance recorded successfully");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}
);

app.post('/view-details', async (req, res) => {
    const { student_id } = req.body;

    try {
        const details = await view.viewDetails(client, student_id);
        console.log(details);
        return res.status(201).send("Successful");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post('/view-student-list', second, async (req, res) => {
    try {
        const list = await view.viewStudentList(client);
        console.log(list);
        return res.status(201).send("View successfully completed");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.delete('/admin/delete-student/:student_id', ADMIN, async (req, res) => {
    const studentID = req.params.student_id;
    try {
        const student = await find.findStudentById(studentID);
        if (!student) {
            return res.status(404).send('Student not found');
        }
        const result = await others.deleteStudent(client, studentID);
        if (result.deletedCount > 0) {
            res.status(200).send('Student data has been deleted');
        } else {
            res.status(500).send('Failed to delete student data');
        }
    } catch (error) {
        console.error("Error deleting student data:", error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/report', async (req, res) => {
    const { student_id } = req.body;

    try {
        const details = await view.viewDetails(client, student_id);
        const attendanceDetails = await others.report(client, details.student_id);

        if (attendanceDetails && attendanceDetails.length > 0) {
            const datesAndStatus = attendanceDetails.map(entry => ({
                date: entry.date,
                status: entry.status
            }));

            console.log(datesAndStatus);
            return res.status(200).send("Successful");
        } else {
            return res.status(404).send("Attendance details not found");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

async function existing(Username) {
    return await client
        .db('Starting')
        .collection('users')
        .find({ "username": { $eq: Username } })
        .toArray();
}

async function generateToken(userData) {
    const token = jwt.sign(
        {
            username: userData.username,
            role: userData.role
        },
        'Holy',
        { expiresIn: 600 }
    );

    console.log(token);
    return token;
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
            if (decoded.role != "Admin") {
                return res.status(401).send('Unauthorized');
            }
            console.log(decoded.role)
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
            if (decoded.role != "Staff" || decoded.role != "Admin") {
                return res.status(401).send('Unauthorized');
            }
            console.log(decoded.role)
        }
        next();
    });
}