export const environment: any = {
    production: window["production"],
    rooting: {
        enableTracing: false,
    },
    routes: {
        enableTracing: false,
    },
    loginApiUrl: window["loginApiUrl"],
    apiUrl:   window['apiUrl'], 
    iserveApiUrl :  window['iserveApiUrl'] + "/iserve",
    // apiUrl:"http://80.227.151.58:8100" ,
    // iserveApiUrl : "http://192.168.68.102:8810",
    webSeocketEndPoint:window['webSeocketEndPoint'] ,
    webSeocketTopic:window['webSeocketTopic'] ,
    webSeocketSendRequestURL:window['SedRequestUrl'],
    protocol: window['protocol'],
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
    },
};
