var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");

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
    console.log(shops)
    res.send(shops);
});


router.get("/", async function (req, res) {
    let data = await client.get("/stores")
    let arr = [];
    let stores = [];
    for (let i = 0; i < data.length; i++) {
        stores.push(data[i].location.longitude);
        stores.push(data[i].location.latitude);
        stores.push(data[i].name);
        stores.push(data[i].addr);
        arr.push(stores);
        stores = []
    }
    // const shops = [
    //     [104.062275, 30.685623, "爱心宠物店", "成都通锦大厦一楼"],
    //     [104.079726, 30.64296, "蠢萌宠物店", "四川省成都市武侯区林荫中街8号"],
    //     [104.119394, 30.672233, "玲珑宠物店", "建设南路1号"],
    //     [104.077363, 30.600042, "卡哇伊宠物店", "天顺路225号"]
    // ];
    res.send(arr);
});
module.exports = router;
