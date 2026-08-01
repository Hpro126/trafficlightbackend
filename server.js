=const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();

app.use(cors());

let camera1Frame = null;
let camera2Frame = null;


const server = app.listen(
    process.env.PORT || 10000,
    ()=>{
        console.log("Server Running");
    }
);


const wss = new WebSocket.Server({
    server
});


wss.on("connection",(ws,req)=>{


    console.log("Connected:",req.url);


    if(req.url === "/cam1"){

        console.log("Camera 1 online");

        ws.on("message",(frame)=>{
            camera1Frame = frame;
        });

    }


    if(req.url === "/cam2"){

        console.log("Camera 2 online");

        ws.on("message",(frame)=>{
            camera2Frame = frame;
        });

    }


});



function stream(res,getFrame){

    res.writeHead(200,{
        "Content-Type":
        "multipart/x-mixed-replace; boundary=frame",

        "Cache-Control":"no-cache",

        "Connection":"keep-alive"
    });


    const timer=setInterval(()=>{


        let frame=getFrame();


        if(frame){

            res.write("--frame\r\n");

            res.write(
            "Content-Type: image/jpeg\r\n\r\n"
            );

            res.write(frame);

            res.write("\r\n");

        }


    },50);



    res.on("close",()=>{
        clearInterval(timer);
    });

}



app.get("/stream1",(req,res)=>{

    stream(
        res,
        ()=>camera1Frame
    );

});


app.get("/stream2",(req,res)=>{

    stream(
        res,
        ()=>camera2Frame
    );

});



app.get("/",(req,res)=>{

    res.send(
        "Dual Traffic Camera Server Running"
    );

});