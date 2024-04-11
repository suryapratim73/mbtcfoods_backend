require("dotenv").config();
const { Sequelize, DataTypes, UUIDV4 } = require("sequelize");


const {
    DB_HOST:host,
    DB:database,
    DB_USER:username,
    DB_PASSWORD:password
} = process.env;

const sequelize = new Sequelize({
    dialect:"mysql",
    host,
    database,
    username,
    password,
    logging:false
});

sequelize.authenticate()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log("Connection failed",err)
});

const enquiry = {
    id:{
        type:DataTypes.UUID,
        defaultValue:UUIDV4,
        primaryKey:true
    },
    name:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    address:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    contact:{
        type:DataTypes.TEXT
    },
    topic:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    message:{
        type:DataTypes.TEXT
    },
    sellID:{
        type:DataTypes.UUID
    },
    obj:{
        type:DataTypes.JSON,
        defaultValue:{}
    }
}

module.exports = {
    sequelize,
    enquiry:sequelize.define("enquiry",enquiry,{
        freezeTableName:true
    })
}