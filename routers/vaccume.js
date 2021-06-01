const router = require("express").Router()
const db = require("../database/mySql")

const fs = require("fs")
const util = require("util")
const removeFile = util.promisify(fs.unlink)

router.get("/", (req, res) => {
    db.query("SELECT * FROM vaccumetable", function (err, result, fields) {
        if (err) {
            return res.send(err)
        } else {
            return res.send(result)
        }
    });
})

router.post("/send", (req, res) => {
    const { date, shift, machine_Sl_No, checked_by, process1_result, process2_result, process3_result, process4_result, process5_result, process6_result, process7_result, process8_result, process9_result, description } = req.body
    var sql = `INSERT INTO vaccumetable (date,shift,machine_Sl_No,checked_by, process1_result, process2_result, process3_result, process4_result, process5_result, process6_result, process7_result, process8_result, process9_result,description) VALUES ('${date}','${shift}','${machine_Sl_No}','${checked_by}','${process1_result}','${process2_result}','${process3_result}','${process4_result}','${process5_result}','${process6_result}','${process7_result}','${process8_result}','${process9_result}','${description}')`;
    db.query(sql, function (err, result) {
        if (err) {
            return res.send(false)
        } else {
            return res.send(true)
        }
    });
})

router.post("/datefilter", (req, res) => {
    const { from, to } = req.body
    const fromdate = from
    const todate = to
    const daterange = `SELECT * FROM vaccumetable WHERE DATE BETWEEN '${fromdate} 00:00:00' and '${todate} 00:00:00'`
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
        await db.query("SELECT * FROM vaccumetable", function (err, result, fields) {
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

    const url = await workbook.xlsx.readFile("./templates/vaccume.xlsx")
        .then(async function () {
            var worksheet = workbook.getWorksheet(1);
            for (var i = 0; i < data.length; i++) {
                var row = await worksheet.getRow(Number(21) + Number(i));
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