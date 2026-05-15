import ICAL from "https://unpkg.com/ical.js/dist/ical.min.js";

document.addEventListener("DOMContentLoaded", function() {
  main();
});

async function fetchJSONData() {
    const response = await fetch('./salar.json');

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
}

async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const text = await response.text();
    const jcalData = await ICAL.parse(text);
    return jcalData
  } catch (error) {
    console.error(error.message);
  }
}

function getTodaysEvents(jcalData) {
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    // 1. Get today's date (at midnight for easy comparison)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Filter events
    const todaysEvents = vevents.filter(vevent => {
        const event = new ICAL.Event(vevent);
        const eventDate = event.startDate.toJSDate();
        
        // Reset time to midnight to compare just the calendar day
        eventDate.setHours(0, 0, 0, 0);

        return eventDate.getTime() === today.getTime();
    });
    return todaysEvents
}

function unBooked(todaysEvents, startHour, endHour){
    var now = new Date();
    
    const start = now.setHours(startHour,0,0,0)
    const end = now.setHours(endHour,15,0,0)

    //console.log(todaysEvents)

    for (var vevent of todaysEvents) {
        const event = new ICAL.Event(vevent);
        const eventStartDate = event.startDate.toJSDate();
        const eventEndDate = event.endDate.toJSDate();
        //console.log(vevent)
        //console.log(event.summary)
        //console.log(eventStartDate)
        //console.log(eventEndDate)
        if ( ( eventStartDate >= start && eventStartDate < end ) || ( eventEndDate > start && eventEndDate < end ) || (eventStartDate <= start && eventEndDate >= end)) {
            return false
        }
    }
    return true
}


async function main() {
    const url = "https://cloud.timeedit.net/liu/web/schema/ri687QQQY90Zn1Q5108049Z6y6Z55.ics";
    const salar = await fetchJSONData();

    var unbooked_nu_17 = [];
    var unbooked_nu_12 = [];
    var unbooked_nu_plus_2 = [];

    const now = new Date();
    const HourNow = now.getHours();
    //const HourNow = 8;
    const HourNowplus2 = HourNow + 2;
    const MinuteNow = now.getMinutes();
    const date = now.getDate();
    const weekday = now.getDay();
    const month = now.getMonth();

    var dayname = "vet ej";
    var monthname = "vet ej";

    const timeNowString = String(HourNow).padStart(2, '0') + ":" + String(MinuteNow).padStart(2, '0');

    console.log(HourNow)
    if (HourNow >= 22) {
        console.log("Läggdags!")
        document.body.innerHTML = "<h1>Klockan är " + timeNowString + ", gå och lägg dig!<h1>";
        return
    }

    document.getElementById("tid").innerHTML = "Uppdaterat kl " + timeNowString;

    //console.log(weekday)

    if (weekday==1){
        dayname = "måndag";
    }
    if (weekday==2){
        dayname = "tisdag";
    }
    if (weekday==3){
        dayname = "onsdag";
    }
    if (weekday==4){
        dayname = "torsdag";
    }
    if (weekday==5){
        dayname = "fredag";
    }
    if (weekday==6){
        dayname = "lördag";
    }
    if (weekday==0){
        dayname = "söndag";
    }

    if (month==0){
        monthname = "januari";
    }
    if (month==1){
        monthname = "februari";
    }
    if (month==2){
        monthname = "mars";
    }
    if (month==3){
        monthname = "april";
    }
    if (month==4){
        monthname = "maj";
    }
    if (month==5){
        monthname = "juni";
    }
    if (month==6){
        monthname = "juli";
    }
    if (month==7){
        monthname = "augusti";
    }
    if (month==8){
        monthname = "september";
    }
    if (month==9){
        monthname = "oktober";
    }
    if (month==10){
        monthname = "november";
    }
    if (month==11){
        monthname = "december";
    }


    document.getElementById("rub").innerHTML = "Obokade datorsalar i A-huset idag, " + dayname + " den " + date + " " + monthname + ":";

    if (HourNow > 17) {
        document.getElementById("nu-17-rub").innerHTML = "";
        document.getElementById("nu-12-rub").innerHTML = "";
    } else {

        document.getElementById("nu-17-rub").innerHTML = String(HourNow).padStart(2, '0') +":00 - 17:00:";
        document.getElementById("nu-12-rub").innerHTML = String(HourNow).padStart(2, '0') +":00 - 12:00:";
    }
    document.getElementById("nu-plus-2-rub").innerHTML = String(HourNow).padStart(2, '0') +":00 - " + String(HourNowplus2).padStart(2, '0') + ":00:";

    for (var sal of salar) {
        //console.log(sal.name)
        var jcalData = await getData(sal.url)
        var todaysEvents = getTodaysEvents(jcalData)
        //console.log(sal)
        if (todaysEvents.length == 0) { // Om inga event på hela dagen alltså obokad lägg till i listor
            unbooked_nu_17.push(sal.name)
            unbooked_nu_12.push(sal.name)
            unbooked_nu_plus_2.push(sal.name)
        } else {
            if (unBooked(todaysEvents,HourNow,17)) {
                unbooked_nu_17.push(sal.name)
            }
            if (unBooked(todaysEvents,HourNow,12)) {
                unbooked_nu_12.push(sal.name)
            }
            if (unBooked(todaysEvents,HourNow,HourNowplus2)) {
                unbooked_nu_plus_2.push(sal.name)
            }
        }
    }

    if (HourNow > 17) {
        document.getElementById("nu-17").innerHTML = "";
        document.getElementById("nu-12").innerHTML = "";
    }else {
        document.getElementById("nu-17").innerHTML = "";
        for (sal of unbooked_nu_17) {
            document.getElementById("nu-17").innerHTML = document.getElementById("nu-17").innerHTML + sal + "<br>";
        }
        if (HourNow < 12) {
        document.getElementById("nu-12").innerHTML = "";
            for (sal of unbooked_nu_12) {
                document.getElementById("nu-12").innerHTML = document.getElementById("nu-12").innerHTML + sal + "<br>";
            }
        }else {
            document.getElementById("nu-12-rub").innerHTML = "";
            document.getElementById("nu-12").innerHTML = "";
        }
    }

    document.getElementById("nu-plus-2").innerHTML = "";
    for (sal of unbooked_nu_plus_2) {
        document.getElementById("nu-plus-2").innerHTML = document.getElementById("nu-plus-2").innerHTML + sal + "<br>";
    }
}