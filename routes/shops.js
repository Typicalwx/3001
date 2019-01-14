var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");
var axios = require("axios")

// 获取各个城市的店铺数
router.get("/counts", async function (req, res) {
    const shops = [];
    // const qingdao = [120.33, 36.07, 0, "青岛"]
    // const lasha = [91.11, 29.97, 0, "拉萨"]
    // const shanghai = [121.48, 31.22, 0, "上海"]
    // const zhangjiakou = [114.87, 40.82, 0, "张家口"]
    const ningbo = [121.56, 29.86, 0, "宁波"]
    // const kunming = [102.73, 25.04, 0, "昆明"]
    // const shenyang = [123.38, 41.8, 0, "沈阳"]
    const chengdu = [104.06, 30.67, 0, "成都"]
    // const beijin = [116.46, 39.92, 0, "北京"]
    let data = await client.get("/stores")
    for (let i = 0; i < data.length; i++) {
        if (data[i].city == "成都市") {
            chengdu[2] = chengdu[2] + 1
        } else if (data[i].city == "宁波市") {
            ningbo[2] = ningbo[2] + 1
        }
    }
    if (chengdu[2] != 0) {
        shops.push(chengdu)
    }
    if (ningbo[2] != 0) {
        shops.push(ningbo)
    }
    res.send(shops);
});


router.get("/", async function (req, res) {
    let { lng, lat } = req.query;
    console.log(lng, lat)
    let dataone = await axios({
        method: "get",
        url: `http://api.map.baidu.com/geocoder/v2/?location=${lat},${lng}`,
        params: {
            output: "json",
            ak: "RWyhbCT21EEcHX8R4P2A0Wi7nsIeROMr"
        }
    })
    console.log(dataone.data.result.addressComponent.city)
    let data = await client.get("/stores")
    let newarr = [];
    let arr = [];
    let stores = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].city == dataone.data.result.addressComponent.city) {
            newarr.push(data[i])
        }
    }
    console.log(newarr)
    for (let i = 0; i < newarr.length; i++) {
        stores.push(newarr[i].location.lng);
        stores.push(newarr[i].location.lat);
        stores.push(newarr[i].name);
        stores.push(newarr[i].addr);
        arr.push(stores);
        stores = []
    }
    console.log(arr)
    res.send(arr);
});
module.exports = router;
