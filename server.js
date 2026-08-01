const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());


// Receive raw JPEG frames
app.use(express.raw({
    type: "image/jpeg",
    limit: "10mb"
}));


let camera1 = null;
let camera2 = null;


// ==========================
// CAMERA 1 UPLOAD
// ==========================

app.post("/upload1", (req, res) => {

    camera1 = req.body;

    console.log(
        "Camera 1 frame:",
        camera1.length,
        "bytes"
    );

    res.send("OK");

});



// ==========================
// CAMERA 2 UPLOAD
// ==========================

app.post("/upload2", (req, res) => {

    camera2 = req.body;

    console.log(
        "Camera 2 frame:",
        camera2.length,
        "bytes"
    );

    res.send("OK");

});



// ==========================
// CAMERA 1 LIVE STREAM
// ==========================

app.get("/stream1", (req, res) => {


    res.writeHead(200, {

        "Content-Type":
        "multipart/x-mixed-replace; boundary=frame",

        "Cache-Control":
        "no-cache",

        "Connection":
        "keep-alive"

    });



    const interval = setInterval(() => {


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




// ==========================
// CAMERA 2 LIVE STREAM
// ==========================

app.get("/stream2", (req, res) => {


    res.writeHead(200, {

        "Content-Type":
        "multipart/x-mixed-replace; boundary=frame",

        "Cache-Control":
        "no-cache",

        "Connection":
        "keep-alive"

    });



    const interval = setInterval(() => {


        if(camera2){


            res.write(
                "--frame\r\n"
            );


            res.write(
                "Content-Type: image/jpeg\r\n\r\n"
            );


            res.write(camera2);


            res.write(
                "\r\n"
            );


        }


    },100);



    req.on("close",()=>{

        clearInterval(interval);

    });


});




// ==========================
// TEST ROUTE
// ==========================

app.get("/",(req,res)=>{

    res.send(
        "Smart Traffic AI Live Stream Backend Running"
    );

});



// ==========================
// START SERVER
// ==========================

const PORT = process.env.PORT || 10000;


app.listen(PORT,()=>{

    console.log(
        "Server running on port",
        PORT
    );

});