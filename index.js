const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())

app.post('/login', (req, res) => {

    console.log(req.body.username,req.body.password)

    if(req.body.username != 'password' || req.body.password != 'username'){
        return res.status(400).send('Cuba lagi')
    }
    res.send('Login success')
})      

/*app.post('/api/echo', (req, res) => {

}) */

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})

