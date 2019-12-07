var express = require("express")
var router = express.Router();

router.get("/", function(req, res, next) {
    res.send({res: "API is working properly new "});
});

module.exports = router;
