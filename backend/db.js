const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
// const connectToMongo = () => {
//     mongoose.connect(mongoURI, () => {

//         console.log("Connected to Mongo Successfully");
       
//     })
// }
const connectToMongo = () =>{
    mongoose.connect("mongodb://localhost:27017/inotebook")
    .then(()=>console.log("connection success"))
    .catch((err)=>console.log(err));
}

module.exports = connectToMongo;
