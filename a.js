const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const port = process.env.PORT || 3000;
const dbName = 'VMS';
const saltRounds = 10;
const collection1 = "User"
const collection2 = "Visitor" 
const collection3 = "visitorpass"
app.use(express.json());

/*const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cybercafe Visitor Management System',
      description: 'API for managing visitors in a cybercafe',
      version: '1.0.0',
    },
  },
  apis: ['./Cybercafe.js'], //files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/group23', swaggerUi.serve, swaggerUi.setup(swaggerSpec));*/


//connect to mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://kang:Kangcn2001@cluster0.qsrp4df.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.use(express.json());
    app.listen(port, () => {
      console.log('Server listening at http://localhost:${port}');
    });
    

//admin login configuration
app.post('/login', async (req, res) => {
  try{
    const result =  await login(req.body.username, req.body.password)
    if (result.message == 'Correct password') {
      const user = await client.db(dbName).collection(collection1).findOne({username: req.body.username});
      const token = await generateToken({ username: req.body.username , role: user.role});
      res.send({ message: 'Successful login', token });
    } else {
      res.send('Login unsuccessful');
    }
  }catch(error){
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

// Security register security configuration
app.post('/create/security', authenticateSecurity, async (req, res) => {
  try{
    let result = await registersecurity(
      req.body.username,
      req.body.password,
      req.body.email
      ); 
      res.send(result);
    }catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
   }
});

// 1.2) test register admin configuration
app.post('/create/test/admin', async (req, res) => {
  try{
    let result = await registeradmin(
      req.body.username,
      req.body.password,
      req.body.email
      ); 
      res.send(result);
    }catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
   }
});


// 1.1) Security register admin configuration
app.post('/create/admin', authenticateSecurity, async (req, res) => {
  try{
    let result = await registeradmin(
      req.body.username,
      req.body.password,
      req.body.email
      ); 
      res.send(result);
    }catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
   }
});


// admin view created user
app.get('/view/user/admin', authenticateAdmin, async (req, res) => {
  try {
    const result = await client
    .db('VMS')
    .collection('User')
    .find()
    .toArray();
    
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
    }
});


//user create visitor
app.post('/create/visitor/admin', authenticateAdmin, async (req, res) => {
  try{
    let result = await createvisitor(
      req.body.visitorname,
      req.body.timespend,
      req.body.age,
      req.body.phonenumber,
      ); 
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  //2) admin view created visitor
  app.get('/view/visitor/admin', authenticateAdmin, async (req, res) => {
    try {
      const result = await client
      .db('VMS')
      .collection('Visitor')
      .find()
      .toArray();
    
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });


  // 3) Admin issue visitor pass 
    app.post('/issue/visitorpass', authenticateAdmin, async (req, res) => {
      try {
        const { visitorname, idproof, timespend, payment } = req.body;

        // Validate input data
        if (!visitorname || !idproof || !timespend || !payment) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        // Check if visitor exists
        const existingVisitor = await client.db(dbName).collection("Visitor").findOne({ "visitorname": visitorname });

        if (existingVisitor) {
            // If visitor already exists, update the timespend and payment
            await client.db(dbName).collection("Visitor").updateOne(
                { "visitorname": visitorname },
                { $set: { "timespend": timespend, "payment": payment } }
            );
            return res.status(200).json({ message: 'Visitor pass updated.' });
        } else {
            // If visitor doesn't exist, create a new record (visitor pass)
            const visitorPass = {
                "visitorname": visitorname,
                "idproof": idproof,
                "timespend": timespend,
                "payment": payment,
            };

            // Create a visitor record
            createvisitor(visitorname, timespend, req.body.age, req.body.phonenumber);

            // Insert the visitor pass record
            await client.db(dbName).collection("visitorpass").insertOne(visitorPass);

            return res.status(200).json({ message: 'Visitor pass recorded.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 4) visitor view visitorpass
    app.get('/view/visitorpass', async (req, res) => {
      try {
      const result = await client
          .db('VMS')
          .collection('visitorpass')
          .find()
          .toArray();
  
      res.send(result);
      } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
      }
  });

  // 5) Login page
  app.post('/login/page', async (req, res) => {
    try{
      const result =  await login(req.body.username, req.body.password)
      if (result.message == 'Correct password') {
        const user = await client.db(dbName).collection(collection1).find().toArray();
        res.send({ message: 'Successful login', user });
      } else {
        res.send('Login unsuccessful');
      }
    }catch(error){
          console.error(error);
          res.status(500).send("Internal Server Error");
      };
  });

  // 6.1 view role
app.get('/view/user/admin', authenticateAdmin, async (req, res) => {
  try {
    const result = await client
    .db('VMS')
    .collection('User')
    .find()
    .toArray();
    
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
    }
});

// 6.2) security view visitorpass
app.get('/view/contactnumber', authenticateSecurity, async (req, res) => {
  try {
  const result = await client
      .db('VMS')
      .collection('visitorpass')
      .find()
      .toArray();

  res.send(result);
  } catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
  }
});

        
  }catch (e) {
    console.error(e);

  }  
  finally {
    // Ensures that the client will close when you finish/error
  }
}

run().catch(console.dir);




//function 放下面

async function login(requsername, reqpassword) {
  let matchUser = await client.db('VMS').collection('User').findOne({ username:requsername });

  if (!matchUser)
    return { message: "User not found!" };
  const isPasswordValid = await bcrypt.compare(reqpassword, matchUser.password);
  console.log("run");
  if (isPasswordValid)
    return { message: "Correct password", user: matchUser };
  else
   return { message: "Invalid password" };
}



async function registeradmin(requsername, reqpassword, reqemail) {
  try {
    const hash = await bcrypt.hash(reqpassword, 10);

    // Assuming createvisitor is a function that returns a visitor object
    //const visitor = await createvisitor("VisitorName", "0", 25, "123456789", requsername);

    await client.db(dbName).collection(collection1).insertOne({
      "username": requsername,
      "password": hash,
      "email": reqemail,
      "role": "admin",
    });

    return "Admin is created.";
  } catch (error) {
    console.error(error);
    return "Error creating user.";
  }
}


async function registersecurity(requsername, reqpassword, reqemail) {
  try {
    const hash = await bcrypt.hash(reqpassword, 10);

    // Assuming createvisitor is a function that returns a visitor object
    //const visitor = await createvisitor("VisitorName", "0", 25, "123456789", requsername);

    await client.db(dbName).collection(collection1).insertOne({
      "username": requsername,
      "password": hash,
      "email": reqemail,
      "role": "security",
    });

    return "Security is created.";
  } catch (error) {
    console.error(error);
    return "Error creating user.";
  }
}


async function createvisitor(reqvisitorname, reqtimespend = "0", reqage, reqphonenumber = "0") {
  try {
    await client.db(dbName).collection(collection2).insertOne({
      "visitorname": reqvisitorname,
      "timespend": reqtimespend,
      "age": reqage,
      "phonenumber": reqphonenumber,
    });
    return "Visitor is added.";
  } catch (error) {
    console.error(error);
    return "Error creating user.";
  }
}

  // Function to issue visitor pass 
  async function issuevisitorpass(req, res) {
    try {
      // Validate the request body
      const { visitorname, idproof, timespend, payment } = req.body;
      if (!visitorname || !idproof || !timespend || !payment) {
        return res.status(400).json({ error: 'Invalid input data' });
      }
  
      // Get the user ID from the token
      const userId = getUserIdFromToken(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Verify that the user has admin privileges (modify this condition based on your user roles)
      const isAdmin = checkAdminPrivileges(userId);
      if (!isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Now you can use idproof, timespend, and payment
      const existingVisitor = await client.db(dbName).collection("Visitor").findOne({ "visitorname": visitorname });
  
      if (existingVisitor) {
        // If visitor already exists, update the timespend and payment or perform other actions as needed
        await client.db(dbName).collection("Visitor").updateOne(
          { "visitorname": visitorname },
          { $set: { "timespend": timespend, "payment": payment } }
        );
        return res.status(200).json({ message: 'Visitor pass updated.' });
      } else {
        // If visitor doesn't exist, create a new record (visitor pass)
        const visitorPass = {
          "visitorname": visitorname,
          "idproof": idproof,
          "timespend": timespend,
          "payment": payment,
        };
  
        await client.db(dbName).collection("visitorpass").insertOne(visitorPass);
        return res.status(200).json({ message: 'Visitor pass recorded.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  //token function
const jwt = require('jsonwebtoken');

function generateToken(userData) {
  const token = jwt.sign(
    userData,
    'password',
    {expiresIn: 600}
  );

  console.log(token);
  return token;
}

function verifyToken(req, res, next) {
  let header = req.headers.authorization;
  if (!header) {
    res.status(401).send('Unauthorized');
    return;
  }

  let token = header.split(' ')[1];

  jwt.verify(token, 'password', function (err, decoded) {
    if (err) {
      res.status(401).send('Unauthorized');
      return;
    }
    req.admin = decoded;
    next();
  });
}



function authenticateAdmin(req, res, next) {
  let header = req.headers.authorization;
  if (!header) {
    res.status(401).send('Unauthorized, missing token');
    return;
  }

  let token = header.split(' ')[1];

  jwt.verify(token, 'password', function (err, decoded) {
    if (err) {
      res.status(403).send('Invalid token');
      return;
    }else{
      if(decoded.role !== 'admin'){
        res.status(403).send("Forbidden: Insufficient permissions")
      }
      //add this in case your response is in another route, therefore you can retrieve the token at the terminal
      console.log('Decoded token:',decoded);
      return next();
    }
  });
}


function authenticateSecurity(req, res, next) {
  let header = req.headers.authorization;
  if (!header) {
    res.status(401).send('Unauthorized, missing token');
    return;
  }

  let token = header.split(' ')[1];

  jwt.verify(token, 'password', function (err, decoded) {
    if (err) {
      res.status(403).send('Invalid token');
      return;
    }else{
      if(decoded.role !== 'security'){
        res.status(403).send("Forbidden: Insufficient permissions")
      }
      //add this in case your response is in another route, therefore you can retrieve the token at the terminal
      console.log('Decoded token:',decoded);
      return next();
    }
  })
}