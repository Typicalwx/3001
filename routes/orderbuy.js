var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");





//产生订单
router.post('/', async function (req, res) {
    let {petmasterID,shoppingtrolley} = req.body
    //shoppingtrolley是购物车的东西，拆分
    let shoppingtrolley1 = JSON.parse(shoppingtrolley)
    let myDate = new Date()
    let newarr=[]//存储用户并过滤
    for(let i=0;i<shoppingtrolley1.length;i++){
        newarr.push(shoppingtrolley1[i].storeId)
    }
    //过滤后的数组
    var fillterarr = newarr.filter(function(element,index,self){
        return self.indexOf(element) === index;
    });
         for(let j=0;j<fillterarr.length;j++){
             let orderarr=[];
             let storeId;
             let ordertotal1=0;
            for(let i=0;i<shoppingtrolley1.length;i++){
                if(shoppingtrolley1[i].storeId==fillterarr[j]){
                    storeId = fillterarr[j]
                    delete shoppingtrolley1[i].storeId;
                    orderarr.push(shoppingtrolley1[i]);
                    ordertotal1 += shoppingtrolley1[i].total
                }
            }
            await client.post("/orderbuy",{ 
                stores: {
                    $ref: "stores",
                    $id: storeId
                },petmaster:{
                    $ref: "petmaster",
                    $id: petmasterID
                },
                orderarr,
                statebuy:"未完成",
                buytime:myDate.toLocaleDateString()+" "+myDate.toLocaleTimeString(),
                ordertotal1,
            })
         }
    res.send({ status: 1 })
});



//查询订单
router.get("/", async function (req, res) {
    let { type, text, page, rows } = req.query;
    let seraobj = {};
    if (type) {
        seraobj = { [type]: text }
    }
    let data = await client.get("/orderbuy", { page, rows, ...seraobj, submitType: "findJoin", ref: ["stores", "petmaster"] })
    res.send(data);
})


module.exports = router;