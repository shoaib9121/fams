import { Injectable } from "@angular/core";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { environment } from "src/environments/environment";
import { Subject } from "rxjs";
import { GlobalVariables } from "../../global-variables.service";


@Injectable({
	providedIn: "root"
})
export class WebSocketService {
	webSocketEndPoint: string; //'http://192.168.18.36:8100/insurance/cm-websocket';
	topic: string;//"/topic/checkClaimStatus";
	sendRequest: string;
	stompClient: any;
	jwt: any;
	LoginId = window.localStorage.getItem("webSocket_id");
	private notification$ = new Subject();
	public notification = this.notification$.asObservable();
	
	constructor (public globals: GlobalVariables) {
		this.webSocketEndPoint = environment.webSeocketEndPoint;
		this.topic = this.globals.CURRENT_APP_NAME === "insurance" ? environment.webSeocketTopic : environment.webSocketRequestTopic;
		this.jwt = window.localStorage.getItem("jwt");
		this.sendRequest = this.globals.CURRENT_APP_NAME === "insurance" ? environment.webSeocketSendRequestURL : environment.webSocketSendRequestURLFams;
	}
	
	_connect () {
		let ws = new SockJS(this.webSocketEndPoint);
		this.stompClient = Stomp.over(ws);
		const _this = this;
		_this.stompClient.connect({"X-Authorization": _this.jwt}, function (frame) {
			let url = ws._transport.url;
			
			url = url.replace(_this.webSocketEndPoint, "");
			url = url.replace("/websocket", "");
			var n = url.lastIndexOf("/");
			url = url.substring(n);
			let sessionId = url;
			_this.stompClient.subscribe(_this.topic + sessionId, function (sdkEvent) {
				_this.onMessageReceived(sdkEvent);
			});
			_this.stompClient.send(_this.sendRequest, {"X-Authorization": _this.jwt}, JSON.parse(_this.LoginId));
		}, this.errorCallBack);
	};
	
	_disconnect () {
		if (this.stompClient !== null) {
			this.stompClient.disconnect();
		}
		console.log("Disconnected");
	}
	
	// on error, schedule a reconnection attempt
	errorCallBack (error) {
		console.log("errorCallBack -> " + error);
		setTimeout(() => {
			this._connect();
		}, 5000);
	}
	
	/**
	 * Send message to sever via web socket
	 * @param {*} message
	 */
	_send (message) {
		this.stompClient.send("/app/hello", {}, JSON.stringify(message));
	}
	
	acknowledgeNotification (userId) {
		this.stompClient.send("/acknowledgeNotification", {}, (userId));
	}
	
	onMessageReceived (message) {
		this.notification$.next(message);
	}
}
