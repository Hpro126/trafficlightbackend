const express=require("express");
const WebSocket=require("ws");
const cors=require("cors");


const app=express();

app.use(cors());


let latestFrame=null;



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
(ws)=>{


console.log(
"ESP32 connected"
);


ws.on(
"message",
(frame)=>{


latestFrame=frame;


});


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


if(latestFrame){


res.write(
"--frame\r\n"
);


res.write(
"Content-Type:image/jpeg\r\n\r\n"
);


res.write(
latestFrame
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