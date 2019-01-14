var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");
const multiparty = require("multiparty");
const path = require("path");



// router.get('/', async function (req, res) {
//     let { page, rows, type, value } = req.query;
//     let searchObj = {};
//     if (type) {
//         searchObj = { [type]: value };
//     }
//     let data = await client.get('/supplier', { page, rows, ...searchObj, submitType: "findJoin", ref: "users" });
//     res.send(data);
// });

router.get('/', async function (req, res, next) {
    let { type, value, page, rows, storeId } = req.query
    let searchObj = {};
    if (type) {
        searchObj = { [type]: value }
    }
    let data = await client.get("/supplier", { page, rows, ...searchObj, submitType: "findJoin", ref: "users", });
    res.send(
        data,
    )
});

/*供应商品删除*/
router.delete('/:id', async function (req, res, next) {
    let id = req.params.id
    await client.delete("/supplier/" + id)
    res.send({ status: 1 });
});

router.post("/upload", async function (req, res) {
    let form = new multiparty.Form({
        uploadDir: "./public/upload"//手动在public下建一个upload文件，图片上传会存到这个文件
    });
    form.parse(req, function (err, fields, files) {
        console.log(files); //{[{}]}的形式
        let key = Object.keys(files)[0];
        if (err) {
            res.send(err);
        } else {
            // res.send(path.basename(files.uploadHeader[0].path));//path是文件名
            res.send(path.basename(files[key][0].path))//这种方法解决上传时不同的name
        }
    })
})
// router.get('/:id', async function (req, res, next) {
//     let id = req.params.id
//     let data = await client.get("/users/" + id)
//     res.send(data);
//   });
router.get('/:id', async function (req, res, next) {
    let id = req.params.id
    let data = await client.get("/supplier/" + id, {
        submitType: "findJoin", ref: "users",
    });
    console.log(data)
    res.send(data[0])
});

/* 修改供应商详情 */
router.put('/:id', async function (req, res, next) {
    let id = req.params.id
    let { name, addr, phone, web, licenseImage, remark } = req.body
    await client.put("/supplier/" + id, {
        name, addr, phone, web, licenseImage, remark,
    })
    res.send({ status: 1 });
});
module.exports = router;
