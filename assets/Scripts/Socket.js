// var ws = null;
// var GLB = require('GLBConfig');
// var WS = {
//     ws: ws,
//     obj: null,
// };
// var bInter = false; //判断是否已经开始心跳包
// var bError = false;
// var creatWS = function (argument) {
//     ws = null;
//     if (window.wx || cc.sys.os === cc.sys.OS_IOS)
//         ws = new WebSocket("wss://websocket.windgzs.cn/MusicGame"); //wx/ios
//     // else if (cc.sys.os === cc.sys.OS_ANDROID)
//     else {
//         ws = new WebSocket("ws://47.107.178.120:8088/MusicGame"); //anroid其中安卓ssl连不上
//     }
//     // else
//     //     ws = new WebSocket("wss://websocket.windgzs.cn/MusicGame"); //本地
//     WS.ws = ws;
//     ws.onopen = function (event) {
//      console.log("Send Text WS was opened.");
//      if (GLB.msgBox)
//         GLB.msgBox.active = false;
//      if (bInter == false){
//         window.setInterval(function (argument) {
//              WS.sendMsg("");
//          }, 30000);
//         bInter = true;
//      }
//     };
//     ws.onmessage = function (event) {
//         var data = event.data;
//         // console.log("response text msg: " + data);
//         var i1 = data.indexOf(":");
//         if (i1 == -1)
//             return;
//         if (WS.obj == null)
//             return;
//         var cmd = data.substring(0, i1);
//         var sResponse = data.substring(i1+1);
//         WS.obj.onResponse(cmd, sResponse);
//     };
//     ws.onerror = function (event) {
//      console.log("Send Text fired an error.", event);
//      bError = true;
//     };
//     ws.onclose = function (e) {
//         if (e.code && e.code.toString() != "1001" && GLB.msgBox)
//             GLB.msgBox.active = true;
//          console.log("WebSocket instance closed.", e.code + ' ' + e.reason + ' ' + e.wasClean);
//          if (bError == false)
//             creatWS();
//     };
// }
// WS.sendMsg = function (cmd, msg, obj) {
//     if (cmd == null)
//         return;
//     if (ws.readyState === WebSocket.OPEN) {
//         msg = msg || "";
//         if (cmd == ""){
//             ws.send(cmd);
//             return;
//         }
//         var str = cmd + ":" + msg.toString();
//         // console.log("sendMsg = ", str);
//         ws.send(str);
//         if (obj != null){
//             WS.obj = obj;
//         }
//     }
//     else {
//         console.log("WebSocket instance wasn't ready...");
//     }
// };
// WS.close = function (argument) {
//     ws.close();
// };
// WS.reconnect = function (argument) {
//     bError = false;
//     creatWS();
// };
// creatWS();
// module.exports = WS;