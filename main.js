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

    for (var vevent of todaysEvents) {
        const event = new ICAL.Event(vevent);
        const eventStartDate = event.startDate.toJSDate();
        const eventEndDate = event.endDate.toJSDate();
        //console.log(eventStartDate)
        if ( ( eventStartDate > start && eventStartDate < end ) || ( eventEndDate > start && eventEndDate < end ) ) {
            return false
        }else {
            return true
        }
    }
}


async function main() {
    const url = "https://cloud.timeedit.net/liu/web/schema/ri687QQQY90Zn1Q5108049Z6y6Z55.ics";
    const salar = await fetchJSONData();

    var unbooked_nu_17 = [];
    var unbooked_nu_12 = [];
    var unbooked_nu_plus_2 = [];

    const now = new Date();
    const HourNow = now.getHours();
    const HourNowplus2 = HourNow + 2;

    if (HourNow > 17) {
        document.getElementById("nu-17-rub").innerHTML = "";
        document.getElementById("nu-12-rub").innerHTML = "";
    } else {

        document.getElementById("nu-17-rub").innerHTML = "Obokade datasalar mellan "+ HourNow +":00 och 17:00:";
        document.getElementById("nu-12-rub").innerHTML = "Obokade datasalar mellan "+ HourNow +":00 och 12:00:";
    }
    document.getElementById("nu-plus-2-rub").innerHTML = "Obokade datasalar mellan "+ HourNow +":00 och " + HourNowplus2 + ":00:";

    for (var sal of salar) {
        //console.log(sal.name)
        var jcalData = await getData(sal.url)
        var todaysEvents = getTodaysEvents(jcalData)
        if (todaysEvents.length == 0) {
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
        document.getElementById("nu-17").innerHTML = unbooked_nu_17;
        document.getElementById("nu-12").innerHTML = unbooked_nu_12;
    }

    document.getElementById("nu-plus-2").innerHTML = unbooked_nu_plus_2;
}