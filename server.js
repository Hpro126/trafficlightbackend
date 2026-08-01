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


// Camera 1 upload
app.post("/upload1", (req, res) => {

    camera1 = req.body;

    console.log(
        "Camera 1:",
        camera1.length,
        "bytes"
    );

    res.send("OK");
});


// Camera 2 upload
app.post("/upload2", (req, res) => {

    camera2 = req.body;

    console.log(
        "Camera 2:",
        camera2.length,
        "bytes"
    );

    res.send("OK");
});


// Stream function
function sendStream(req, res, camera) {

    res.writeHead(200, {
        "Content-Type":
        "multipart/x-mixed-replace; boundary=frame",

        "Cache-Control":
        "no-cache",

        "Connection":
        "keep-alive"
    });


    const timer = setInterval(() => {

        if(camera !== null) {

            res.write("--frame\r\n");

            res.write(
                "Content-Type: image/jpeg\r\n\r\n"
            );

            res.write(camera);

            res.write("\r\n");

        }

    }, 200);


    req.on("close", () => {

        clearInterval(timer);

    });

}


// Camera 1 live stream
app.get("/stream1", (req,res)=>{

    sendStream(
        req,
        res,
        camera1
    );

});


// Camera 2 live stream
app.get("/stream2", (req,res)=>{

    sendStream(
        req,
        res,
        camera2
    );

});


app.get("/", (req,res)=>{

    res.send(
        "Smart Traffic AI Backend Running"
    );

});


const PORT = process.env.PORT || 10000;


app.listen(PORT,()=>{

    console.log(
        "Server running on port",
        PORT
    );

});