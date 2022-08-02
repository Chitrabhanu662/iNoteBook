
const connectToMongo = require('./db');
var cors = require('cors')
connectToMongo();
const express = require('express')
const app = express()
// const port = 5000

app.use(cors())
app.use(express.json())

// available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV=="production"){
    app.use(express.static("frontend/build"));
    const path = require("path");
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname + '/frontend/build/index.html'));
    }
    )
}



// app.listen(port, () => {
//     console.log(`iNotebook backend listening at http://localhost:${port}`)
// })
app.listen(process.env.PORT || 5000);