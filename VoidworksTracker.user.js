// ==UserScript==
// @name         Voidworks Tracker
// @version      1.1
// @description  Track when Voidworks becomes available
// @author       Flutterz
// @match        https://www.neopets.com/games/voidworks/*
// @match        https://www.neopets.com/tvw/
// @match        https://www.neopets.com/tvw/index.phtml
// @grant        none
// ==/UserScript==


//SETTINGS!
const use24 = false; //Set to true for 24 hour time and false for AM/PM
const timeZone = 0; //Set to however many hours off from NST you are to use your timezone instead of NST
//SETTINGS!


if (document.URL.includes("games/voidworks")){
    //Get the time and store it when loading voidworks
    let d = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
    let vwTime = d.getTime() + 86400000 + 60000;
    window.localStorage.setItem('voidworksTime', vwTime);
} else {
    let vw = document.getElementsByClassName("plothub-title")[0];
    if (vw.innerText.includes("Voidworks")){
        //Get the time and calculate how long to wait
        let d = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
        let curTime = d.getTime();
        let vwTime = window.localStorage.getItem('voidworksTime');
        let remTime = vwTime - curTime;
        //If need to wait, edit the text
        if (remTime > 0){
            //Convert remaining time to human readable
            let remHour = Math.floor(remTime/3600000);
            let remMin = Math.floor((remTime%3600000)/60000);
            //Convert target time to human readable
            let vwHour = new Date(Number(vwTime));
            let vwMin = vwHour.getMinutes();
            if (remMin<10) remMin = "0"+remMin;
            if (vwMin<10) vwMin = "0"+vwMin;
            vwHour = vwHour.getHours();
            //Set AM/PM and time zone
            let tz = " NST";
            if (timeZone != 0){
                tz = " Local";
                vwHour = (vwHour + timeZone)%24;
            }
            if ((!use24)&&(vwHour < 0)){
                vwHour = vwHour + 12;
                if (vwHour == 0) vwHour = 12;
                tz = " PM" + tz;
            } else if ((!use24)&&(vwHour < 12)){
                if (vwHour == 0) vwHour = 12;
                tz = " AM" + tz;
            } else if (!use24){
                vwHour = Math.abs(vwHour-12);
                if (vwHour == 0) vwHour = 12;
                tz = " PM" + tz;
            }
            //Edit the text
            vw.innerText = "Voidworks Available in " + remHour + ":" + remMin + " (" + vwHour + ":" + vwMin + tz + ")";
            vw.style = "color:#500;";
        }
    }
}
