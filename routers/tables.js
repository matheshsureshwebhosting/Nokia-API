const router=require("express").Router()
const db = require("../database/mySql")
router.get("/vaccumetable", (req, res) => {
    var sql = "CREATE TABLE vaccumetable (date VARCHAR(255),shift VARCHAR(255),machine_Sl_No VARCHAR(255),checked_by VARCHAR(255), process1_result VARCHAR(255), process2_result VARCHAR(255), process3_result VARCHAR(255), process4_result VARCHAR(255), process5_result VARCHAR(255), process6_result VARCHAR(255), process7_result VARCHAR(255), process8_result VARCHAR(255), process9_result VARCHAR(255),description VARCHAR(255))";
    db.query(sql, function (err, result) {
        if (err) {
            return res.send(err)
        } else {
            return res.send("Table Created")
        }

    });
})
router.get("/solderingtable", (req, res) => {
    var sql = "CREATE TABLE solderingtable (date VARCHAR(255),shift VARCHAR(255),machine_Sl_No VARCHAR(255),station VARCHAR(255),catridge_used VARCHAR(255),temperature VARCHAR(255),checked_by VARCHAR(255),status VARCHAR(255))";
    db.query(sql, function (err, result) {
        if (err) {
            return res.send(err)
        } else {
            return res.send("Table Created")
        }

    });
})

router.get("/otatable", (req, res) => {
    var sql = "CREATE TABLE otatable (date VARCHAR(255),machine_Sl_No VARCHAR(255),shift VARCHAR(255),checked_by VARCHAR(255), ota1 VARCHAR(255), ota2 VARCHAR(255), ota3 VARCHAR(255), ota4 VARCHAR(255), ota5 VARCHAR(255), ota6 VARCHAR(255), ota7 VARCHAR(255), ota8 VARCHAR(255), ota9 VARCHAR(255),ota10 VARCHAR(255),description VARCHAR(255))";
    db.query(sql, function (err, result) {
        if (err) {
            return res.send(err)
        } else {
            return res.send("Table Created")
        }

    });
})

router.get("/uwatable", (req, res) => {
    var sql = "CREATE TABLE uwatable (date VARCHAR(255),machine_Sl_No VARCHAR(255),shift VARCHAR(255),checked_by VARCHAR(255), uwa1 VARCHAR(255), uwa2 VARCHAR(255), uwa3 VARCHAR(255), uwa4 VARCHAR(255), uwa5 VARCHAR(255), uwa6 VARCHAR(255), uwa7 VARCHAR(255), uwa8 VARCHAR(255), uwa9 VARCHAR(255),uwa10 VARCHAR(255),description VARCHAR(255))";
    db.query(sql, function (err, result) {
        if (err) {
            return res.send(err)
        } else {
            return res.send("Table Created")
        }

    });
})

router.get("/*", (req, res) => {
    return res.send("page not found")
})
module.exports=router