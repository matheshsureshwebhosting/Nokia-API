const mysql=require("mysql")

const mysqlConnections=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"nokia",
    multipleStatements:true
})

mysqlConnections.connect((error)=>{
    if(error) {
        return console.log(error)
    }else{
        return console.log("DB Connected")
    }
})

module.exports=mysqlConnections