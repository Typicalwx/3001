var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");







router.get("/salesvolume", async function (req, res) {
    let { storeId } = req.query;
    console.log(storeId)
    let data = await client.get("/orderbuied", {
        "stores.$id": storeId,
        submitType: "findJoin", ref: "stores",
    })
    // console.log(data)
    let sales = []
    let k = 0
    var myDate = new Date()
    for (let i = 0; i < 6; i++) {
        let date = myDate.toLocaleDateString()
        let nowDate = date.split("-")
        if (nowDate[1] - i <= 0) {
            nowDate[1] = 12 - i + 1;
            nowDate[0] = nowDate[0] - 1
        }
        let obj = {}
        obj.date = nowDate[0] + "." + nowDate[1];
        obj.total = 0
        sales.push(obj)
        for (let m = 0; m < data.length; m++) {
            let ordergoodarr = data[m].ordergoodarr
            let dtArr = data[m].buytime.split(" ");
            console.log(dtArr, "结构前")
            dtArr = dtArr[0].split("-");
            console.log(dtArr, "结构后")
            if (nowDate[0] == dtArr[0] && dtArr[1] == nowDate[1]) {
                for (let j = 0; j < ordergoodarr.length; j++) {
                    sales[i].total += ordergoodarr[j].total;
                }
                data.splice(m, 1);
                console.log(data.length)
                m--;
            }
        }
    }
    res.send(sales);
});


module.exports = router;