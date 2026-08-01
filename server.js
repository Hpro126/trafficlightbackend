const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.raw({
    type: "image/jpeg",
    limit: "10mb"
}));

let camera1 = null;
let camera2 = null;


// Receive Camera 1
app.post("/upload1",(req,res)=>{

    camera1 = req.body;

    res.send("OK");

});


// Receive Camera 2
app.post("/upload2",(req,res)=>{

    camera2 = req.body;

    res.send("OK");

});



// LIVE STREAM CAMERA 1
app.get("/stream1",(req,res)=>{

    res.writeHead(200,{
        "Content-Type":
        "multipart/x-mixed-replace; boundary=frame",
        "Cache-Control":"no-cache",
        "Connection":"keep-alive"
    });


    const interval=setInterval(()=>{

        if(camera1){

            res.write(
                "--frame\r\n"
            );

            res.write(
                "Content-Type: image/jpeg\r\n\r\n"
            );

            res.write(camera1);

            res.write(
                "\r\n"
            );

        }

    },100);


    req.on("close",()=>{

        clearInterval(interval);

    });

});



// LIVE STREAM CAMERA 2
app.get("/stream2",(req,res)=>{

    res.writeHead(200,{
        "Content-Type":
        "multipart/x-mixed-replace; boundary=frame",
        "Cache-Control":"no-cache",
        "Connection":"keep-alive"
    });


    const interval=setInterval(()=>{

        if(camera2){

            res.write("--frame\r\n");

            res.write(
              "Content-Type: image/jpeg\r\n\r\n"
            );

            res.write(camera2);

            res.write("\r\n");

        }

    },100);


    req.on("close",()=>{

        clearInterval(interval);

    });

});



app.get("/",(req,res)=>{
    res.send("Smart Traffic AI Live Stream Backend");
});


const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
    console.log(
        "Server running on",
        PORT
    );
});