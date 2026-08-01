const express=require("express");
const WebSocket=require("ws");
const cors=require("cors");


const app=express();

app.use(cors());


let camera1Frame=null;
let camera2Frame=null;



const server=app.listen(
process.env.PORT || 10000,
()=>{
console.log("Running");
}
);



const wss =
new WebSocket.Server({
server
});



wss.on(
"connection",
(ws,req)=>{


console.log(
"ESP32 connected",
req.url
);



if(req.url==="/cam1"){


ws.on(
"message",
(frame)=>{

camera1Frame=frame;

});


}



if(req.url==="/cam2"){


ws.on(
"message",
(frame)=>{

camera2Frame=frame;

});


}



});





app.get(
"/stream1",
(req,res)=>{


res.writeHead(
200,
{
"Content-Type":
"multipart/x-mixed-replace; boundary=frame",

"Cache-Control":"no-cache",

"Connection":"keep-alive"
}
);



setInterval(()=>{


if(camera1Frame){


res.write(
"--frame\r\n"
);


res.write(
"Content-Type:image/jpeg\r\n\r\n"
);


res.write(
camera1Frame
);


res.write(
"\r\n"
);


}


},50);


});






app.get(
"/stream2",
(req,res)=>{


res.writeHead(
200,
{
"Content-Type":
"multipart/x-mixed-replace; boundary=frame",

"Cache-Control":"no-cache",

"Connection":"keep-alive"
}
);



setInterval(()=>{


if(camera2Frame){


res.write(
"--frame\r\n"
);


res.write(
"Content-Type:image/jpeg\r\n\r\n"
);


res.write(
camera2Frame
);


res.write(
"\r\n"
);


}


},50);


});





app.get(
"/",
(req,res)=>{

res.send(
"Traffic Camera Live Server"
);

});