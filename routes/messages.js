const express = require('express');
const router = express.Router();
const pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "pub-c-429f6a06-3919-4096-8a89-00c0cd424857",
    subscribe_key : "sub-c-26edd9ee-4c67-11e6-85a4-0619f8945a4f"
});

router.get("/", function (req, res, next) {
  pubnub.history({
    channel : 'segunda_prueba',
    count : 100,
    reverse : false,
    callback : function(m){
        console.log(JSON.stringify(m));
        res.status(200).json(m)
    },
    error     : function(e) {
      console.log( "FAILED! RETRY PUBLISH!", e );
      res.status(400).json({success:true, data: e});
    }
});
});

router.post('/', function(req, res, next) {

  pubnub.publish({
    channel   : 'segunda_prueba',
    message   : req.body,
    callback  : function(e) {
      console.log( "SUCCESS!", e );
      res.status(201).send();
    },
    error     : function(e) {
      console.log( "FAILED! RETRY PUBLISH!", e );
      res.status(400).json({success:true, data: e});
    }
  });
});

module.exports = router;
