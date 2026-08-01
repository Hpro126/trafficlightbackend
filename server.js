const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.raw({
    type:"image/jpeg",
    limit:"10mb"
}));

let camera1 = null;
let camera2 = null;


app.post("/upload1",(req,res)=>{

    camera1 = Buffer.from(req.body);

    console.log(
        "CAM1:",
        camera1.length
    );

    res.send("OK");

});


app.post("/upload2",(req,res)=>{

    camera2 = Buffer.from(req.body);

    console.log(
        "CAM2:",
        camera2.length
    );

    res.send("OK");

});



function streamCamera(req,res,getFrame){


    res.writeHead(200,{

        "Content-Type":
        "multipart/x-mixed-replace; boundary=frame",

        "Cache-Control":
        "no-cache",

        "Connection":
        "keep-alive"

    });



    let timer=setInterval(()=>{


        let frame=getFrame();


        if(frame){


            res.write(
                "--frame\r\n"
            );


            res.write(
                "Content-Type: image/jpeg\r\n\r\n"
            );


            res.write(frame);


            res.write(
                "\r\n"
            );

        }


    },200);



    req.on("close",()=>{

        clearInterval(timer);

    });

}



app.get("/stream1",(req,res)=>{

    streamCamera(
        req,
        res,
        ()=>camera1
    );

});



app.get("/stream2",(req,res)=>{

    streamCamera(
        req,
        res,
        ()=>camera2
    );

});



app.get("/",(req,res)=>{

    res.send(
        "Traffic Camera Server Online"
    );

});



const PORT =
process.env.PORT || 10000;


app.listen(PORT,()=>{

console.log(
"Running on "+PORT
);

});