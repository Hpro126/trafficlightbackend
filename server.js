const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.raw({ type: "image/jpeg", limit: "10mb" }));

let camera1 = null;
let camera2 = null;


// Camera North-South
app.post("/upload1", (req, res) => {

    camera1 = req.body;

    console.log("Camera 1 frame received:",
        camera1.length, "bytes");

    res.send("OK");
});


// Camera East-West
app.post("/upload2", (req, res) => {

    camera2 = req.body;

    console.log("Camera 2 frame received:",
        camera2.length, "bytes");

    res.send("OK");
});


// Website fetches camera 1
app.get("/camera1", (req,res)=>{

    if(camera1){
        res.writeHead(200,{
            "Content-Type":"image/jpeg"
        });

        res.end(camera1);
    }
    else{
        res.status(404).send("No camera 1 feed");
    }

});


// Website fetches camera 2
app.get("/camera2", (req,res)=>{

    if(camera2){
        res.writeHead(200,{
            "Content-Type":"image/jpeg"
        });

        res.end(camera2);
    }
    else{
        res.status(404).send("No camera 2 feed");
    }

});


app.get("/",(req,res)=>{
    res.send("Smart Traffic AI Backend Running");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(
      "Server running on port",
      PORT
    );
});