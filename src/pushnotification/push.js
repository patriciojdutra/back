var FCM = require('fcm-node');
    var serverKey = 'AAAAJCejK_k:APA91bFeph1hMJ60BJGMDDeztq_V_nRSpxjIPMQxSQuTIKdqNtcqs9QXMPe3oBAgzzWvkmDLv0VEaWMOTPl3MRHcNujwqI_RcQstLR9fpYAny-b_yGVwqloFvma7bldS2258gz6iIbtk';
    var fcm = new FCM(serverKey);

function sendMessage(token){

    var message = {
        to: token,
            notification: {
                title: 'NotifcatioTestAPP',
                body: '{"Message from node js app"}',
            },
    
            data: { //you can send only notification or only data(or include both)
                title: 'ok cdfsdsdfsd',
                body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
            }
    
        };

        fcm.send(message, function(err, response) {
            if (err) {
                console.log("Something has gone wrong!"+err);
                console.log("Respponse:! "+response);
            } else {
                // showToast("Successfully sent with response");
                console.log("Successfully sent with response: ", response);
            }
    
        });
}

module.exports = {
    sendMessage
}


    

    