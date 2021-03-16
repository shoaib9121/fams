// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: any = {
	production: window["production"],
	routes: {
		enableTracing: false,
	},
	loginApiUrl: window["loginApiUrl"],
	apiUrl: window["apiUrl"],
	iserveApiUrl: window["iserveApiUrl"] + "/iserve",
	webSeocketEndPoint: window["webSeocketEndPoint"],
	webSeocketTopic: window["webSeocketTopic"],
	webSeocketSendRequestURL: window["SedRequestUrl"],
	webSocketRequestTopic: window["webSocketRequestTopic"],
	webSocketSendRequestURLFams: window["SedRequestUrlFams"],
	protocol: window["protocol"],
	corporateIdentity: {
		primaryColor: "#008755",
		accentColor: "",
		secondaryColor: "",
		warnColor: "",
		spinner: {
			backgroundColor: "",
			spinnerColor: "",
		},
		theme: "light",
		logo: {
			lightPath: "assets/dubai-police.svg",
			darkPath: "assets/dubai-police_green.svg",
			alt: "Dubai Police Logo"
		}
	}
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
