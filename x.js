const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022210217:Meg04fEK7vmuXK0h@class0.qzwsbgr.mongodb.net/?retryWrites=true&w=majority";

const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');

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
            const token = await others.generateToken(user);
            res.send('Login Succesful, your token is \n' + token);
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

app.post('/admin/create-user/students', others.ADMIN, async (req, res) => {
    try {
        const { username, password, student_id, email, phone, PA } = req.body;

        // Check if the username already exists
        const existingUser = await others.existingusers(client, username);

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

app.post('/admin/create-user/staff', others.ADMIN, async (req, res) => {
    try {
        const { username, password, staff_id, email, phone } = req.body;

        // Check if the username already exists
        const existingUser = await others.existingusers(client, username);

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

app.post('/faculty/create-subject', others.second, async (req, res) => {
    try {
        const { name, code, credit, faculty, program, session } = req.body;

        // Check if the username already exists
        const existingSubject = await others.existingsubjects(client, code);

        if (existingSubject.length > 0) {
            // If a user with the same username already exists, return a 400 response
            console.log(existingSubject);
            return res.status(400).send('Subject already exists');
        }

        // If the username is unique, proceed to create the new student
        create.createSubject(client, name, code, credit, faculty, program, session);
        return res.status(201).send("Subject created successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post('/faculty/create-program', others.second, async (req, res) => {
    try {
        const { name, code, faculty, subject, session } = req.body;

        // Check if the username already exists
        const existingProgram = await others.existingprograms(client, code);

        if (existingProgram.length > 0) {
            // If a user with the same username already exists, return a 400 response
            console.log(existingProgram);
            return res.status(400).send('Program already exists');
        }

        // If the username is unique, proceed to create the new student
        create.createPrograms(client, name, code, faculty, subject, session);
        return res.status(201).send("Program created successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post('/admin/create-faculty', others.ADMIN, async (req, res) => {
    try {
        const { name, code, program, session } = req.body;

        // Check if the username already exists
        const existingFaculty = await others.existingfaculties(client, code);

        if (existingFaculty.length > 0) {
            // If a user with the same username already exists, return a 400 response
            console.log(existingFaculty);
            return res.status(400).send('Faculty already exists');
        }

        // If the username is unique, proceed to create the new student
        create.createFaculty(client, name, code, program, session);
        return res.status(201).send("Faculty created successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post('/students/record/:student_id', others.student, (req, res) => {
    const { date, status } = req.body;

    try {
        others.recordattendance(client, req.params.student_id, date, status);
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

app.post('/view-student-list', others.second, async (req, res) => {
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

app.patch('/faculty/update-student', others.second, async (req, res) => {
    const { student_id, code } = req.body;

    try {
        others.addStudent(client, code, student_id);
        return res.status(201).send("Student added successfully");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.delete('/admin/delete-student/:student_id', others.ADMIN, async (req, res) => {
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})