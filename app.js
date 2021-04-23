const express = require("express")
const cros = require("cors")
const db = require("./database/mySql")
const port = 4000
var app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cros("http://localhost:3000"))

app.get("/createtable", (req, res) => {
    var sql = "CREATE TABLE customersdata (version VARCHAR(255), status VARCHAR(255),date VARCHAR(255), author VARCHAR(255), owner VARCHAR(255), reviewed_by VARCHAR(255), reviewed_date VARCHAR(255), approver VARCHAR(255), approval_date VARCHAR(255), description VARCHAR(255))";
    db.query(sql, function (err, result) {
        if (err) {
            return res.send(err)
        } else {
            return res.send("Table Created")
        }

    });
})

app.post("/send", (req, res) => {
    const { version, status, date, author, owner, reviewed_by, reviewed_date, approver, approval_date, description } = req.body    
    var newdate = new Date();
    var cdate = newdate.toLocaleString('en-US', { hour12: true })
    const testvalues = {
        version: "1.0",
        status: status,
        date: cdate,
        author: "Nokia",
        owner: "Nokia",
        reviewed_by: reviewed_by,
        reviewed_date: cdate,
        approver: "Nokia",
        approval_date: cdate,
        description: description
    }

    const values=["1.0",status,cdate,"Nokia","Nokia",reviewed_by,cdate,"Nokia",cdate,description]
    var sql = `INSERT INTO customersdata (version, status,date, author, owner, reviewed_by, reviewed_date, approver, approval_date, description) VALUES ('1.0','${status}','${cdate}','Nokia','Nokia','${reviewed_by}','${cdate}','Nokia','${cdate}','${description}')`;          
    db.query(sql, function (err, result) {
        if (err) {
            return res.send(err)
        } else {
            return res.send("Data Inserted")
        }
    });

})

app.get("/getdatas",(req,res)=>{
    db.query("SELECT * FROM customersdata", function (err, result, fields) {
        if (err){
            return res.send(err)
        }else{            
            return res.send(result)
        }
      });
})
app.listen(port, () => { console.log(`App running on ${port}`) })