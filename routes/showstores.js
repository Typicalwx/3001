var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");
var axios = require("axios")
var _ = require("lodash")
// 获取各个城市的店铺数
router.get("/counts", async function (req, res) {
    let data = await client.get("/stores");
    let arr = [];
    let obj = [];
    for (let i = 0; i < data.length; i++) {
        arr = []
        let dataone = await axios({
            method: "get",
            url: `http://api.map.baidu.com/geocoder/v2/?location=${
                data[i].location.lat
                },${
                data[i].location.lng
                }`,
            params: {
                output: "json",
                ak: "RWyhbCT21EEcHX8R4P2A0Wi7nsIeROMr"
            }
        })
        arr.push(0);
        arr.push(dataone.data.result.addressComponent.city);
        let datatwo = await axios({
            method: "get",
            url: "http://api.map.baidu.com/geocoder/v2/",
            params: {
                output: "json",
                ak: "RWyhbCT21EEcHX8R4P2A0Wi7nsIeROMr",
                address: dataone.data.result.addressComponent.city
            }
        })
        arr.unshift(datatwo.data.result.location.lat);
        arr.unshift(datatwo.data.result.location.lng);
        obj.push(arr);
    };
    for (let i = 0; i < obj.length; i++) {
        for (let j = i + 1; j < obj.length; j++) {
            if (obj[i][3] == obj[j][3]) {
                obj.splice(j, 1)
                j--
            }
        }
    }
    for (let i = 0; i < obj.length; i++) {
        for (let j = 0; j < data.length; j++) {
            if (obj[i][3] == data[j].city) {
                obj[i][2] = obj[i][2] + 1;
            }
        }
    }
    console.log(obj)
    res.send(obj)
});

router.get('/', async function (req, res, next) {
    let { userId } = req.query
    let type = "users.$id"
    if (!userId) {
        type = "name"
    }
    let obj = { [type]: userId }
    let data = await client.get("/stores", {
        ...obj,
        submitType: "findJoin", ref: "users",
    });
    res.send(data)
});










module.exports = router;