var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");
//产生订单
router.post('/', async function (req, res) {
    let { petmasterID, shoppingtrolley } = req.body
    //shoppingtrolley是购物车的东西，拆分
    let shoppingtrolley1 = JSON.parse(shoppingtrolley)
    let myDate = new Date()
    let newarr = []//存储用户并过滤
    for (let i = 0; i < shoppingtrolley1.length; i++) {
        newarr.push(shoppingtrolley1[i].storeId)
    }
    //过滤后的数组
    var fillterarr = newarr.filter(function (element, index, self) {
        return self.indexOf(element) === index;
    });

   


    let a = 1;
    for (let j = 0; j < fillterarr.length; j++) {
        let ordergoodarr = [];
        let orderservearr = [];
        let storeId;
        let ordertotal1 = 0;
        a++;
        var outTradeNo = "";  //订单号
        for (var i = 0; i < 10; i++) //10位随机数，用以加在时间戳后面。
        {
            outTradeNo += Math.floor(Math.random() * 10);
        }
        outTradeNo = new Date().getTime() + outTradeNo + a;  //时间戳，用来生成订单号。



        for (let i = 0; i < shoppingtrolley1.length; i++) {
            if (shoppingtrolley1[i].storeId == fillterarr[j]) {
                storeId = fillterarr[j]
                delete shoppingtrolley1[i].storeId;
                if (shoppingtrolley1[i].goodState == "商品") {
                    ordergoodarr.push(shoppingtrolley1[i]);
                } else {
                    orderservearr.push(shoppingtrolley1[i]);
                }


                ordertotal1 += shoppingtrolley1[i].total
            }
        }
        await client.post("/orderbuy", {
            stores: {
                $ref: "stores",
                $id: storeId
            }, petmaster: {
                $ref: "petmaster",
                $id: petmasterID
            },
            outTradeNo,
            ordergoodarr,
            orderservearr,
            statebuy: false,
            statebuytwo: "未发货",
            butornobuy: false,
            butornobuytwo: "未付款",
            buytime: myDate.toLocaleDateString() + " " + myDate.toLocaleTimeString(),
            ordertotal1,
        })
    }
    res.send({ status: 1 })
});
//查询已完成
router.get("/orderbuied", async function (req, res) {

    let { type, text, page, rows } = req.query;
    let seraobj = {};
    if (type) {
        seraobj = { [type]: text }
    }
    let data = await client.get("/orderbuied", { page, rows, ...seraobj, submitType: "findJoin", ref: ["stores", "petmaster"] })
    res.send(data);
})
//查询已完成单个订单
router.get("/:id", async function (req, res) {
    let id = req.params.id;

    let data = await client.get("/orderbuy/" + id)
    res.send(data);

});

//查询未完成订单
router.get("/", async function (req, res) {
    let { type, text, page, rows } = req.query;
    let seraobj = {};
    if (type) {
        seraobj = { [type]: text }
    }

    let data = await client.get("/orderbuy", { page, rows, ...seraobj, submitType: "findJoin", ref: ["stores", "petmaster"] })
    console.log(data)
    res.send(data);
})

//修改订单按钮
router.put('/:id', async function (req, res, next) {
    let id = req.params.id
    let { statebuy, statebuytwo } = req.body
    await client.put("/orderbuy/" + id, {
        statebuy,
        statebuytwo,
    });
    let data = await client.get("/orderbuy/" + id)
    console.log(data)
    if (data.statebuy && data.butornobuy) {
        await client.post("/orderbuied", data);
        await client.delete("/orderbuy/" + id)
    }
    res.send({ status: 1 })
});

module.exports = router;