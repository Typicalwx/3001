var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");


/* GET home page. */
// router.get('/', async function (req, res, next) {
//     res.render('index', { title: 'Express' });
// });

router.post('/', async function (req, res, next) {
    let { userId, name, number, licenseImage, addr, location, city,
        legal, phone, storeImage, feature, commission, clerk } = req.body
        if(clerk||location){
    clerk = JSON.parse(clerk);
    location = JSON.parse(location)
        }

    let data = await client.post("/stores", {
        name, number, licenseImage, addr, location, city,
        legal, phone, storeImage, feature, commission, clerk,
        users: {
            $ref: "users",
            $id: userId
        }
    });
    console.log(data)
    res.send({ status: 1 })
});


router.get('/all', async function (req, res, next) {
    let { type, value, page, rows, storeId } = req.query
    let seraobj = {};
    if (type) {
        seraobj = { [type]: value }
    }
    let data = await client.get("/stores", { page, rows, ...seraobj, submitType: "findJoin", ref: "users",});
    res.send(
        data,
    )
});

router.put('/:id', async function (req, res, next) {
    let { id } = req.params
    let { name, number, licenseImage, addr,  city,
        legal, phone, storeImage, feature,location, commission } = req.body
        if(location){
    location = JSON.parse(location)
    }

    await client.put("/stores/" + id, {
        name, number, licenseImage, addr,  city,
        legal, phone, storeImage, feature, commission, location
    });
    // console.log(data)
    res.send({ status: 1 })
});


router.delete('/:id', async function (req, res, next) {
    let { id } = req.params
    await client.delete("/stores/" + id);
    res.send({ status: 1 })
});

// 注册验证
router.get('/register', async function (req, res) {
    let { phone, account } = req.query;
    let data
    if (account) {
      data = await client.get("/users", { account, findType: "exact" });
    } else if (phone) {
      data = await client.get("/users", { phone, findType: "exact" });
      
    }
    if (data.length > 0) {
      res.send({
        status: 0
      });
    } else {
      res.send({
        status: 1
      });
    }
  });

//统计各个年龄段的人数
router.get('/ceshi',async function(req,res){
    // let data = await client.get("/students");
    let axisData = ["18岁以下","18到30岁","30岁以上"];
    let seriesData = [{name:"18岁以下",value:10},{name:"18到30岁",value:22},{name:"30到50岁",value:500},{name:"50到60岁",value:10},{name:"50岁以上",value:50}];

    res.send({axisData,seriesData});
});

module.exports = router;