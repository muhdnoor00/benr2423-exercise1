const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022210217:Meg04fEK7vmuXK0h@class0.qzwsbgr.mongodb.net/?retryWrites=true&w=majority";

const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())

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

app.get('/IN', async (req, res) => {
    const database = client.db('Final');
    const collection = database.collection('Users');

    // Array of values to match using $in
    const agesToFind = [25, 30];

    // Using $in in the query
    const result = await collection.find({ age: { $in: agesToFind } }).toArray();
    if (!result)
        return res.status(400).send('No such user')
    res.send(result)
})

app.get('/elemMatch', async (req, res) => {
    const database = client.db('Final');
    const collection = database.collection('Books');

    // Using $in in the query
    const result = await collection.find({
        authors: {
            $elemMatch: {
                name: "J.D. Salinger",
                nationality: "American"
            }
        },
        genres: "Fiction"
    }).toArray();
    if (!result)
        return res.status(400).send('No such user')
    res.send(result)
})

app.get('/not', async (req, res) => {
    const database = client.db('Final');
    const collection = database.collection('Books');

    try {
        const result = await collection.find({
            $nor: [
                {
                    authors: {
                        $elemMatch: {
                            name: "J.D. Salinger",
                            nationality: "American"
                        }
                    }
                },
                {
                    genres: "Fiction"
                }
            ]
        }).toArray();

        if (result.length === 0) {
            return res.status(404).send('No books matching the criteria');
        }

        res.send(result);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})