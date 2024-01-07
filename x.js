
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022210217:Meg04fEK7vmuXK0h@class0.qzwsbgr.mongodb.net/?retryWrites=true&w=majority";

const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');

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

// Define a route for the login form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
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

app.post('/record', (req, res) => {
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await findUserByUsername(username);
  
      if (!user) {
        console.log('User not found:', username);
        return res.status(401).send('Invalid username or password');
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (passwordMatch) {
        res.status(200).send('Login successful');
      } else {
        console.log('Incorrect password for user:', username);
        res.status(401).send('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.post('/create-user/students', async (req, res) => {
  const { username, password, student_id, email, role, phone, PA } = req.body;

  try {
    await createStudent(username, password, student_id, email, role, phone, PA);
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/create-user/staff', async (req, res) => {
  const { username, password, staff_id, email, role, phone } = req.body;

  try {
    await createStaff(username, password, staff_id, email, role, phone);
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

app.post('/create-user/admin', async (req, res) => {
  const { username, password, email, role, phone} = req.body;

  try {
    await createAdmin(username, password, email, role, phone);
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

app.delete('/delete-student/:student_id', async (req, res) => {
    const studentID = req.params.student_id;
    try {
      const student = await findStudentById(studentID);
      if (!student) {
        return res.status(404).send('Student not found');
      }
      const result = await deleteStudent(studentID);
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

app.get('/student', (req, res) => {
})

app.get('/attendance-details', (req, res) => {
})

app.get('/report', (req, res) => {
})

app.get('/logout', (req, res) => { 
  res.status(200).send('Logout successfuly'); 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function createStudent(Username, Password, StudentId, Email, Role, Phone, PA) {
  try {
    const database = client.db('AttendanceSystem');
    const collection = database.collection('Users');

    // Create a user object
    const user = {
      username: Username,
      password: Password,
      student_id: StudentId,
      email: Email,
      role: Role,
      phone: Phone,
      PA: PA,
    };
    // Insert the user object into the collection
    await collection.insertOne(user);

    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

async function createStaff(Username, Password, StaffId, Email, Role, Phone) {
  try {
    const database = client.db('AttendanceSystem');
    const collection = database.collection('Users');

    // Create a user object
    const user = {
      username: Username,
      password: Password,
      staff_id: StaffId,
      email: Email,
      role: Role,
      phone: Phone
    };
    // Insert the user object into the collection
    await collection.insertOne(user);

    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

async function createAdmin(Username, Password, Email, Role, Phone) {
  try {
    const database = client.db('AttendanceSystem');
    const collection = database.collection('Users');

    // Create a user object
    const user = {
      username: Username,
      password: Password,
      email: Email,
      role: Role,
      phone: Phone
    };
    // Insert the user object into the collection
    await collection.insertOne(user);

    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

async function findUserByUsername(username) {
    try {
      const database = client.db('AttendanceSystem');
      const collection = database.collection('Users');
  
      // Find the user by username
      const user = await collection.findOne({ username });
  
      return user;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }