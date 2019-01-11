var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");

// 获取各个城市的店铺数
router.get("/counts", function(req,res) {
    const shops = [
        [120.33, 36.07, 10, "青岛"],
        [91.11, 29.97, 6, "拉萨"],
        [121.48, 31.22, 9, "上海"],
        [114.87, 40.82, 10, "张家口"],
        [121.56, 29.86, 2, "宁波"],
        [102.73, 25.04,15, "昆明"],
        [123.38, 41.8, 7, "沈阳"],
        [104.06, 30.67, 3, "成都"],
        [116.46, 39.92, 11, "北京"]
    ];
    res.send(shops);
});

router.get("/",function(req,res){
    const shops = [
        [104.062275,30.685623,  "爱心宠物店","成都通锦大厦一楼"],
        [104.079726,30.64296,  "蠢萌宠物店","四川省成都市武侯区林荫中街8号"],
        [104.119394,30.672233,  "玲珑宠物店","建设南路1号"],
        [104.077363,30.600042,  "卡哇伊宠物店","天顺路225号"]
    ];
    res.send(shops);
});
module.exports = router;
