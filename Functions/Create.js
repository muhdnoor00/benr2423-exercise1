//Create user student function
async function createStudent(client, Username, Password, StudentId, Email, Phone, PA) {
    try {
        const database = client.db('AttendanceSystem');
        const collection = database.collection('Users');

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
        const database = client.db('AttendanceSystem');
        const collection = database.collection('Users');

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

//Create subject function
async function createSubject(client, Name, Code, Credit, Faculty, Program, Session) {
    try {
        const database = client.db('AttendanceSystem');
        const collection = database.collection('Subjects');

        // Create a user object
        const subject = {
            name: Name,
            code: Code,
            credit: Credit,
            faculty: Faculty,
            program: Program,
            session: Session
        };
        // Insert the user object into the collection
        await collection.insertOne(subject);

        console.log("Subject created successfully");
    } catch (error) {
        console.error("Error creating subject:", error);
    }
}

//Create program function
async function createPrograms(client, Name, Code, Faculty, Subjects, Session, Students) {
    try {
        const database = client.db('AttendanceSystem');
        const collection = database.collection('Programs');

        // Create a user object
        const program = {
            name: Name,
            code: Code,
            faculty: Faculty,
            subject: Subjects,
            session: Session,
            students: Students
        };
        // Insert the user object into the collection
        await collection.insertOne(program);

        console.log("Program created successfully");
    } catch (error) {
        console.error("Error creating program:", error);
    }
}

//Create faculty function
async function createFaculty(client, Name, Code, Programs, Session, Students) {
    try {
        const database = client.db('AttendanceSystem');
        const collection = database.collection('Faculties');

        // Create a user object
        const faculty = {
            name: Name,
            code: Code,
            program: Programs,
            session: Session,
            students: Students
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
    createSubject,
    createPrograms,
    createFaculty
}