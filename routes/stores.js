var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");
var axios = require("axios")

/* GET home page. */
// router.get('/', async function (req, res, next) {
//     res.render('index', { title: 'Express' });
// });

router.post('/', async function (req, res, next) {
    let { userId, name, number, licenseImage, addr, city,
        legal, phone, storeImage, feature, commission, clerk } = req.body
    clerk = JSON.parse(clerk);
    console.log(addr)
    let dataAddr = await axios({
        url: "http://api.map.baidu.com/geocoder/v2/",
        method: "get",
        params: {
            address: addr,
            output: "json",
            ak: "dt8FAGr2R28szj0i3FKEAaSZcHtvaBvC"
        }
    })
    console.log(dataAddr.data.result.location)
    location = dataAddr.data.result.location
    await client.post("/stores", {
        name, number, licenseImage, addr, location, city,
        legal, phone, storeImage, feature, commission, clerk,
        users: {
            $ref: "users",
            $id: userId
        }
    });
    res.send({ status: 1 })
});

router.get('/', async function (req, res, next) {
    let { userId } = req.query
    console.log(userId)
    let type = "users.$id"
    if (!userId) {
        type = "name"
    }
    let obj = { [type]: userId }
    let data = await client.get("/stores", {
        ...obj,
        submitType: "findJoin", ref: "users",
    });
    // console.log(data.length)
    // console.log(data)
    res.send(data[0])
});




router.get('/zhaoid', async function (req, res, next) {
    let { userId } = req.query
    console.log(userId)
    // let type = "users.$id"
    // // if (!userId) {
    // //     type = "name"
    // // }
    // let obj = { [type]: userId }
    let data = await client.get("/stores", {
        submitType: "findJoin", ref: "users",
        "users.$id": userId,
    });
    console.log(data.length)
    console.log(data)
    res.send(data[0])
});





router.put('/:id', async function (req, res, next) {
    let { id } = req.params
    let { name, number, licenseImage, addr, location, city,
        legal, phone, storeImage, feature, commission, clerk } = req.body
    clerk = JSON.parse(clerk);
    location = JSON.parse(location)
    await client.put("/stores/" + id, {
        name, number, licenseImage, addr, location, city,
        legal, phone, storeImage, feature, commission, clerk,
    });
    // console.log(data)
    res.send({ status: 1 })
});


router.delete('/:id', async function (req, res, next) {
    let { id } = req.params
    await client.delete("/stores/" + id);
    res.send({ status: 1 })
});
module.exports = router;