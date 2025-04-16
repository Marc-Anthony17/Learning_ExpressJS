const express = require('express');

const app = express();
app.get("/", (req,res) =>{
    res.send({
        msg: "Hello World",
        users: {Name: "Ron", DOB:"Idk"}
    })
})

app.listen(3000, () => {
    console.log('Sever is running on port 3000: ')
});
