const router = require("express").Router()
const db = require("../database/mySql")

const fs = require("fs")
const util = require("util")
const removeFile = util.promisify(fs.unlink)

router.post("/send", (req, res) => {
    const {date,shift,operator_name,uwa1,uwa2,uwa3,uwa4,uwa5,uwa6,uwa7,uwa8,uwa9,uwa10,description} = req.body
    var sql = `INSERT INTO uwatable (date,machine_Sl_No,shift, checked_by, uwa1, uwa2, uwa3, uwa4, uwa5, uwa6, uwa7, uwa8,uwa9,uwa10,description) VALUES ('${date}','Not Provide','${shift}','${operator_name}','${uwa1}','${uwa2}','${uwa3}','${uwa4}','${uwa5}','${uwa6}','${uwa7}','${uwa8}','${uwa9}','${uwa10}','${description}')`;
    db.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            return res.send(false)
        } else {
            return res.send(true)
        }
    });
})

router.get("/", (req, res) => {
    db.query("SELECT * FROM uwatable", function (err, result, fields) {
        if (err) {
            return res.send(err)
        } else {
            return res.send(result)
        }
    });
})


router.post("/datefilter", (req, res) => {
    const { from, to } = req.body
    const fromdate = from
    const todate = to
    const daterange = `SELECT * FROM uwatable WHERE DATE BETWEEN '${fromdate} 00:00:00' and '${todate} 00:00:00'`
    db.query(daterange, function (err, result, fields) {
        if (err) {
            return res.send(err)
        } else {
            return res.send(result)
        }
    });
})

router.get("/export", async (req, res) => {
    const vaccumeformdata = new Promise(async (resolve, reject) => {
        await db.query("SELECT * FROM uwatable", function (err, result, fields) {
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

    const url = await workbook.xlsx.readFile("./templates/uwa.xlsx")
        .then(async function () {
            var worksheet = workbook.getWorksheet(1);
            for (var i = 0; i < data.length; i++) {
                var row = await worksheet.getRow(Number(15) + Number(i));
                row.getCell(1).value = data[i].date;
                row.getCell(2).value = data[i].shift;
                row.getCell(3).value = data[i].checked_by;
                row.getCell(4).value = data[i].uwa1;
                row.getCell(5).value = data[i].uwa2;
                row.getCell(6).value = data[i].uwa3;
                row.getCell(7).value = data[i].uwa4;
                row.getCell(8).value = data[i].uwa5;
                row.getCell(9).value = data[i].uwa6;
                row.getCell(10).value = data[i].uwa7;
                row.getCell(11).value = data[i].uwa8;
                row.getCell(12).value = data[i].uwa9;
                row.getCell(13).value = data[i].uwa10; 
                row.getCell(14).value = data[i].description;                          
            }

            row.commit();
            const path = `./download/uwa_${Date.now()}.xlsx`
            await workbook.xlsx.writeFile(`${path}`);
            const base64file = fs.readFileSync(path, { encoding: 'base64' })
            const contentType = "data:@file/octet-stream;base64,"
            const url = await `http://localhost:${4000}/${path}`
            return {url:url,filepath:path}
        })
    res.send(url.url)
    setTimeout(async()=>{ await removeFile(`${url.filepath}`)},2000)
})


router.get("/*", (req, res) => {
    return res.send("page not found")
})

module.exports = router