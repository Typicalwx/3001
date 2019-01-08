var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");



//服务路由
router.post("/",async function (req,res) {
     let {servename,servesort,servetime,weightrange,
         serverange,elapsedtime,price}= req.body;
     let data = await client.post("/serve", { servename,servesort,servetime,weightrange,
            serverange,elapsedtime,price})
         res.send(data);
})

    


module.exports = router;
