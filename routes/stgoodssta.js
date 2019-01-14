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
    console.log(data)
    let sales = []
    let k = 0
    for (let i = 0; i < data.length; i++) {
        let ordergoodarr = data[i].ordergoodarr
        for (let j = 0; j < ordergoodarr.length; j++) {
            for (k = 0; k < sales.length; k++) {
                if (ordergoodarr[j].shangpingid == sales[k].shangpingid) {
                    sales[k].total += ordergoodarr[j].total;
                    break;
                }
            }
            if (k == sales.length - 1) {
                sales.push(ordergoodarr[j]);
            }
        }

    }
    res.send(sales);
});


module.exports = router;