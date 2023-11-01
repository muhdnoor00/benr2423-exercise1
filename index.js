const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())

app.post('/login', (req, res) => {

    console.log(req.body[0].id,req.body[0].username,req.body[0].password)

    if(req.body[0].username != 'Saya' || req.body[0].password != 'Suka'){
        return res.status(400).send('Cuba lagi')
    }
    res.send('Berjaya')
})

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})