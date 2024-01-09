const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022210217:Meg04fEK7vmuXK0h@class0.qzwsbgr.mongodb.net/?retryWrites=true&w=majority";

//Create user student function
async function createStudent(client, Username, Password, StudentId, Email, Phone, PA) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('users');

        // Create a user object
        const user = {
            username: Username,
            password: Password,
            student_id: StudentId,
            email: Email,
            role: "Student",
            phone: Phone,
            PA: PA,
        };

        // Insert the user object into the collection
        await collection.insertOne(user);
        console.log("User created successfully");
    }
    catch (error) {
        console.error("Error creating user:", error);
    }
}

//Create user staff function
async function createStaff(client, Username, Password, StaffId, Email, Phone) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('users');

        // Create a user object
        const user = {
            username: Username,
            password: Password,
            staff_id: StaffId,
            email: Email,
            role: "Staff",
            phone: Phone
        };
        // Insert the user object into the collection
        await collection.insertOne(user);

        console.log("User created successfully");
    } catch (error) {
        console.error("Error creating user:", error);
    }
}

//Create user admin function
async function createAdmin(client, Username, Password, Email, Phone) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('users');

        // Create a user object
        const user = {
            username: Username,
            password: Password,
            email: Email,
            role: "Admin",
            phone: Phone
        };
        // Insert the user object into the collection
        await collection.insertOne(user);

        console.log("User created successfully");
    } catch (error) {
        console.error("Error creating user:", error);
    }
}

//Create subject function
async function createSubject(client, Name, Code, Credit, Faculty, Program, Session, Students) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('Subjects');

        // Create a user object
        const subject = {
            name: Name,
            code: Code,
            credit: Credit,
            faculty: Faculty,
            program: Program,
            session: Session,
            student: Students
        };
        // Insert the user object into the collection
        await collection.insertOne(subject);

        console.log("Subject created successfully");
    } catch (error) {
        console.error("Error creating subject:", error);
    }
}

//Create program function
async function createPrograms(client, Name, Code, Faculty, Subjects, Students, Session) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('Programs');

        // Create a user object
        const program = {
            name: Name,
            code: Code,
            faculty: Faculty,
            subject: Subjects,
            students: Students,
            session: Session
        };
        // Insert the user object into the collection
        await collection.insertOne(program);

        console.log("Program created successfully");
    } catch (error) {
        console.error("Error creating program:", error);
    }
}

//Create faculty function
async function createFaculty(client, Name, Code, Programs, Students, Session) {
    try {
        const database = client.db('Starting');
        const collection = database.collection('Faculties');

        // Create a user object
        const faculty = {
            name: Name,
            code: Code,
            program: Programs,
            students: Students,
            session: Session
        };
        // Insert the user object into the collection
        await collection.insertOne(faculty);

        console.log("Faculty created successfully");
    } catch (error) {
        console.error("Error creating faculty:", error);
    }
}

module.exports = {
    createStudent,
    createStaff,
    createAdmin,
    createSubject,
    createPrograms,
    createFaculty
}