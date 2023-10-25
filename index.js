const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())

app.get('/hello', (req, res) => { // req = request, res = response, send a GET request
res.send('Hello World!')    // send Hello World as a response
})

/*app.post('/api/echo', (req, res) => {

}) */

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})

