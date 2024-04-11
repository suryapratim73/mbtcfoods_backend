require("dotenv").config()
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");


const { sequelize,enquiry } = require("./model");

let app = express();
app.locals.dbReady = false;

sequelize.sync({force:true})
.then(()=>{
    app.locals.dbReady = true;
});

let transporter = nodemailer.createTransport({
    host:"smtp.hostinger.com",
    port:465,
    secure:true,
    auth:{
        user:"query@food.mbtcverse.com",
        pass:"surya_Shilpi@73"
    }
});

async function sendMail(mailObj){
    try{
        let info = await transporter.sendMail(mailObj);
        console.log("Send Mail response",info.messageId)
    }
    catch(err){
        console.log("Send Mail Error",err);
    }
}

// app.use(express.json());
function testDB(_,res,next){
    if(app.locals.dbReady)
        next();
    else
        res.status(500).send("Server error");
}

app.use(testDB,express.json(),express.urlencoded({parameterLimit:7,extended:true}));

app.use(cors());// This must change

app.get("/",(req,res)=>{// Test route
    res.json({msg:"Server is running"})
});

function simplifyCart(cart){
    if(cart.length===0)
        return "Empty cart";
    else{
        return cart.reduce((acc,{name,product,packingSizes,quality,cutSize,qty,unit,pricePerBag,pricePerPacket})=>{
            let obj = { bag:pricePerBag,packet:pricePerPacket };
            let _unit = Object.keys(obj).find(key=>new RegExp(unit).test(key));
            acc += `${name} ${product} ${packingSizes} ${quality} in ${cutSize}: Requested quantity ${qty} ${unit} @${obj[_unit]}\n`;
            return acc;
        },"");
    }
}

app.post("/post",async (req,res)=>{
    let data = req.body;
    res.status(200).send();
    let mailObj = {
        from:'"MBTC Foods API Relay" <query@food.mbtcverse.com>',
        to:"mbtcverse@gmail.com",
        subject:"Relay: "+data.topic,
        text:`
            From: ${data.name}
            Address: ${data?.address},
            Cart: ${simplifyCart(data.obj)},
            Message:${data?.message || "No message"}
        `
    };  
    sendMail(mailObj);
    enquiry.create({ ...data });
});

app.listen(5000,process.env.IP,()=>console.log(`Server running at port 5000`));