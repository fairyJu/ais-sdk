var https = require("https");
var utils = require("./utils");
var signer = require("./signer");
var ais = require("./ais");

module.exports = {
    super_resolution: function (token, data, scale, model, callback) {

        // 构建请求信息和请求参数信息
        var requestData = {"image": data, "file": "", "scale": scale, "model": model};
        var options = utils.getHttpRequestEntityOptions(ais.IMAGE_ENDPOINT, "POST", ais.SURPER_RESOLUTION, {
            "Content-Type": "application/json",
            "X-Auth-Token": token
        });

        var requestBody = JSON.stringify(requestData);

        var request = https.request(options, function (response) {

            // 验证服务调用返回的状态是否成功，如果为200, 为成功, 否则失败。
            if (response.statusCode !== 200) {
                console.log('Http status code is: ' + response.statusCode);
            }

            // 构建请求信息和请求参数信息
            var resultStr = "";
            response.on("data", function (chunk) {
                resultStr += chunk.toString();
            });

            response.on("end", function () {
                callback(resultStr);
            })
        });

        request.on("error", function (err) {
            console.log(err.message);
        });

        request.write(requestBody);
        request.end();
    },

    super_resolution_aksk: function (_ak, _sk, data, scale, model, callback) {

        // 配置ak，sk信息
        var sig = new signer.Signer();
        sig.AppKey = _ak;               //构建ak
        sig.AppSecret = _sk;            //构建sk

        var requestData = {"image": data, "file": "", "scale": scale, "model": model};
        var req = new signer.HttpRequest();
        var options = utils.getHttpRequestEntity(sig, req, ais.IMAGE_ENDPOINT, "POST", ais.SURPER_RESOLUTION, "", {"Content-Type": "application/json"}, requestData);

        var request = https.request(options, function (response) {

            // 验证服务调用返回的状态是否成功，如果为200, 为成功, 否则失败。
            if (response.statusCode !== 200) {
                console.log('Http status code is: ' + response.statusCode);
            }

            var resultStr = "";
            // 拼接返回结果的base64的字符串
            response.on("data", function (chunk) {
                resultStr += chunk.toString();
            });

            response.on("end", function () {
                callback(resultStr)
            })
        });

        request.on("error", function (err) {
            console.log(err.message);
        });

        request.write(req.body);
        request.end();
    }
};