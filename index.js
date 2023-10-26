const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())

app.post('/api/echo', (req, res) => {
    console.log(req.body)
    res.json(req.body)
    })      

/*app.post('/api/echo', (req, res) => {

}) */

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})

