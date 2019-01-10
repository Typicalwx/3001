var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");



//服务路由
router.post("/",async function (req,res) {
     let {servetype,pets,severname,guige,
        servetime,serveresource,price,desc,storeId}= req.body;
        console.log(req.body)
     let data = await client.post("/serve", {servetype,pets,severname,guige,
        servetime,serveresource,price,desc,
        // stores: {
        //         $ref: "stores",
        //         $id: storeId
        //     }
        })
        res.send(data);
})

router.get("/", async function (req, res) {
        let { type, text, page, rows } = req.query;
        let seraobj = {};
        if (type) { 
            seraobj = { [type]: text }
        }
        let data = await client.get("/serve", { page, rows, ...seraobj, submitType: "findJoin", ref: "stores" })
        res.send(data);
    })
    

//删除
router.delete("/:id",async function (req, res) {
        console.log(1)
        let id = req.params.id
        await client.delete("/serve/" + id) //一定要加一个斜杠
        res.send({ status: 1 });
    });

//查询
router.get("/:id", async function (req, res) {
        let id = req.params.id;
    
        let data = await client.get("/serve/" + id)
        res.send(data);
    
});
//修改
router.put('/:id', async function (req, res, next) {
        let  id  = req.params.id
        console.log(1)
        let { servetype,pets,severname,guige,
                servetime,serveresource,price,desc } = req.body
        await client.put("/serve/" + id, {
                servetype,pets,severname,guige,
                servetime,serveresource,price,desc
        });
        console.log(1)
        res.send({ status: 1 })
    });
module.exports = router;
