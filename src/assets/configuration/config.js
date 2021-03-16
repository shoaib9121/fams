/** DEVELOPMENT **/
window["production"] = false;
window['protocol'] = 'http:';
 window['apiUrl'] = `${window["protocol"]}//80.227.151.58:8100`;
window["loginApiUrl"] = `${window['apiUrl']}/user/login`;
window['iserveApiUrl'] = `${window["protocol"]}//80.227.151.58:8810`;
window['webSeocketEndPoint'] = `${window["apiUrl"]}/cm-websocket`;
window['webSeocketTopic'] = '/topic/checkClaimStatus';
window['webSocketRequestTopic'] = '/topic/checkRequestStatus';
window['SedRequestUrlFams'] = '/app/checkRequestStatus';
window['SedRequestUrl'] = '/app/checkClaimStatus';

/** PRODUCTION **/

/*window["production"] = true;
window['protocol'] = 'http:';
let windowUrl = window.location.host;
window["apiUrl"] = `${window["protocol"]}//${windowUrl}`;
window["loginApiUrl"] = `${window['apiUrl']}/user/login`;
window["iserveApiUrl"] = window["apiUrl"];
window['webSeocketEndPoint'] = `${window["apiUrl"]}/cm-websocket`;
window['webSeocketTopic'] = '/topic/checkClaimStatus';
window['SedRequestUrl'] = '/app/checkClaimStatus';*/
