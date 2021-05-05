const express = require("express")
const cros = require("cors")
const db = require("./database/mySql")
const port = 4000
const fs = require("fs")
var app = express()
const path=require("path")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/download",express.static(path.join(__dirname+"/download")))

app.use(cros("http://localhost:3000"))

app.get("/createtable", (req, res) => {
    var sql = "CREATE TABLE customersdatas (date VARCHAR(255),shift VARCHAR(255),machine_Sl_No VARCHAR(255),checked_by VARCHAR(255),process1_status VARCHAR(255), process1_result VARCHAR(255),process2_status VARCHAR(255), process2_result VARCHAR(255),process3_status VARCHAR(255), process3_result VARCHAR(255),process4_status VARCHAR(255), process4_result VARCHAR(255),process5_status VARCHAR(255), process5_result VARCHAR(255),process6_status VARCHAR(255), process6_result VARCHAR(255),process7_status VARCHAR(255), process7_result VARCHAR(255),process8_status VARCHAR(255), process8_result VARCHAR(255),process9_status VARCHAR(255), process9_result VARCHAR(255),description VARCHAR(255))";
    db.query(sql, function (err, result) {
        if (err) {
            return res.send(err)
        } else {
            return res.send("Table Created")
        }

    });
})
app.get("/soldertablecreate", (req, res) => {
    var sql = "CREATE TABLE soldercustomersdatas (date VARCHAR(255),shift VARCHAR(255),machine_Sl_No VARCHAR(255),station VARCHAR(255),catridge_used VARCHAR(255),temperature VARCHAR(255),checked_by VARCHAR(255),status VARCHAR(255))";
    db.query(sql, function (err, result) {
        if (err) {
            return res.send(err)
        } else {
            return res.send("Table Created")
        }

    });
})
app.post("/soldertablesend", (req, res) => {
    const { date, shift, machine_Sl_No, station, catridge_used, temperature, checked_by, status } = req.body
    var sql = `INSERT INTO soldercustomersdatas (date,shift,machine_Sl_No,station,catridge_used,temperature,checked_by,status) VALUES ('${date}','${shift}','not provide','${station}','${catridge_used}','${temperature}','${checked_by}','${status}')`;
    db.query(sql, function (err, result) {
        if (err) {
            return res.send(err)
        } else {
            return res.send("Data Inserted")
        }
    });
})
app.post("/send", (req, res) => {
    const { date, shift, machine_Sl_No, checked_by, process1_status, process1_result, process2_status, process2_result, process3_status, process3_result, process4_status, process4_result, process5_status, process5_result, process6_status, process6_result, process7_status, process7_result, process8_status, process8_result, process9_status, process9_result, description } = req.body
    var sql = `INSERT INTO customersdatas (date,shift,machine_Sl_No,checked_by,process1_status, process1_result,process2_status, process2_result,process3_status, process3_result,process4_status, process4_result,process5_status, process5_result,process6_status, process6_result,process7_status, process7_result,process8_status, process8_result,process9_status, process9_result,description) VALUES ('${date}','${shift}','${machine_Sl_No}','${checked_by}','process1_status', '${process1_result}','process2_status', '${process2_result}','process3_status', '${process3_result}','process4_status', '${process4_result}','process5_status', '${process5_result}','process6_status', '${process6_result}','process7_status', '${process7_result}','process8_status', '${process8_result}','process9_status', '${process9_result}','${description}')`;
    db.query(sql, function (err, result) {
        if (err) {
            return res.send(err)
        } else {
            return res.send("Data Inserted")
        }
    });


})

app.get("/getdatas", (req, res) => {
    db.query("SELECT * FROM customersdatas", function (err, result, fields) {
        if (err) {
            return res.send(err)
        } else {
            return res.send(result)
        }
    });
})
app.get("/soldertableget", (req, res) => {
    db.query("SELECT * FROM soldercustomersdatas", function (err, result, fields) {
        if (err) {
            return res.send(err)
        } else {
            return res.send(result)
        }
    });
})

app.post("/datefilter", (req, res) => {
    const { from, to } = req.body
    const fromdate = from
    const todate = to
    const daterange = `SELECT * FROM soldercustomersdatas WHERE DATE BETWEEN '${fromdate} 00:00:00' and '${todate} 00:00:00'`
    db.query(daterange, function (err, result, fields) {
        if (err) {
            return res.send(err)
        } else {
            return res.send(result)
        }
    });
})
app.post("/datefiltervaccume", (req, res) => {
    const { from, to } = req.body
    const fromdate = from
    const todate = to
    const daterange = `SELECT * FROM customersdatas WHERE DATE BETWEEN '${fromdate} 00:00:00' and '${todate} 00:00:00'`
    db.query(daterange, function (err, result, fields) {
        if (err) {
            return res.send(err)
        } else {
            return res.send(result)
        }
    });
})

app.get("/exportvaccume", async (req, res) => {
    const vaccumeformdata = new Promise(async (resolve, reject) => {
        await db.query("SELECT * FROM customersdatas", function (err, result, fields) {
            if (err) {
                return resolve(false)
            } else {
                return resolve(result)
            }
        });

    })
    const data = await vaccumeformdata
    var Excel = require('exceljs');
    var workbook = new Excel.Workbook();

  const url=  await workbook.xlsx.readFile("./templates/vaccume.xlsx")
        .then(async function () {
            var worksheet = workbook.getWorksheet(1);
            for (var i = 0; i < data.length; i++) {
                var row = await worksheet.getRow(Number(22) + Number(i));
                row.getCell(1).value = data[i].date;
                row.getCell(2).value = data[i].shift;
                row.getCell(3).value = data[i].machine_Sl_No;
                row.getCell(4).value = data[i].process1_result;
                row.getCell(5).value = data[i].process2_result;
                row.getCell(6).value = data[i].process3_result;
                row.getCell(7).value = data[i].process4_result;
                row.getCell(8).value = data[i].process5_result;
                row.getCell(9).value = data[i].process6_result;
                row.getCell(10).value = data[i].process7_result;
                row.getCell(11).value = data[i].process8_result;
                row.getCell(12).value = data[i].process9_result;
                row.getCell(13).value = data[i].checked_by;
                row.getCell(14).value = data[i].description;
            }

            row.commit();
            const path = `./download/vaccueme_${Date.now()}.xlsx`
           await workbook.xlsx.writeFile(`${path}`);
            const base64file = fs.readFileSync(path, { encoding: 'base64' })
            const contentType = "data:@file/octet-stream;base64,"     
            const url=await `http://localhost:${port}/${path}`
            return url       
        })
    res.send(url)
})

app.get("/exportsoldering", async (req, res) => {
    const vaccumeformdata = new Promise(async (resolve, reject) => {
        await db.query("SELECT * FROM soldercustomersdatas", function (err, result, fields) {
            if (err) {
                return resolve(false)
            } else {
                return resolve(result)
            }
        });

    })
    const data = await vaccumeformdata
    var Excel = require('exceljs');
    var workbook = new Excel.Workbook();

  const url=  await workbook.xlsx.readFile("./templates/soldering.xlsx")
        .then(async function () {
            var worksheet = workbook.getWorksheet(1);
            for (var i = 0; i < data.length; i++) {
                var row = await worksheet.getRow(Number(16) + Number(i));
                row.getCell(1).value = data[i].date;
                row.getCell(2).value = data[i].shift;
                row.getCell(3).value = data[i].machine_Sl_No;
                row.getCell(4).value = data[i].station;
                row.getCell(5).value = data[i].catridge_used;
                row.getCell(6).value = data[i].temperature;
                row.getCell(7).value = data[i].checked_by;
                row.getCell(8).value = data[i].status;        
            }

            row.commit();
            const path = `./download/soldering_${Date.now()}.xlsx`
           await workbook.xlsx.writeFile(`${path}`);
            const base64file = fs.readFileSync(path, { encoding: 'base64' })
            const contentType = "data:@file/octet-stream;base64,"
             const url=await `http://localhost:${port}/${path}`
             return url
        })        
    res.send(url)
})

app.listen(port, () => { console.log(`App running on http://localhost:${port}`) })