//    _________ .__                                                                                        
//    \_   ___ \|  | _____    ______                                                                       
//    /    \  \/|  | \__  \  /  ___/                                                                       
//    \     \___|  |__/ __ \_\___ \                                                                        
//     \______  /____(____  /____  >                                                                       
//            \/          \/     \/                                                                        
//    ________          __                              .__         .__          __                        
//    \______ \ _____ _/  |_  ___________  ___________  |  |   _____|  |   _____/  |______ _______   ____  
//     |    |  \\__  \\   __\/  _ \_  __ \/  ___/\__  \ |  |  /  ___/  | _/ __ \   __\__  \\_  __ \_/ __ \ 
//     |    `   \/ __ \|  | (  <_> )  | \/\___ \  / __ \|  |__\___ \|  |_\  ___/|  |  / __ \|  | \/\  ___/ 
//    /_______  (____  /__|  \____/|__|  /____  >(____  /____/____  >____/\___  >__| (____  /__|    \___  >
//            \/     \/                       \/      \/          \/          \/          \/            \/ 

import ICAL from "https://unpkg.com/ical.js/dist/ical.min.js";

document.addEventListener("DOMContentLoaded", function() {
  main();
});

//       _____ _      ____  ____          _       __      __     _____  _____          ____  _      ______  _____ 
//      / ____| |    / __ \|  _ \   /\   | |      \ \    / /\   |  __ \|_   _|   /\   |  _ \| |    |  ____|/ ____|
//     | |  __| |   | |  | | |_) | /  \  | |       \ \  / /  \  | |__) | | |    /  \  | |_) | |    | |__  | (___  
//     | | |_ | |   | |  | |  _ < / /\ \ | |        \ \/ / /\ \ |  _  /  | |   / /\ \ |  _ <| |    |  __|  \___ \ 
//     | |__| | |___| |__| | |_) / ____ \| |____     \  / ____ \| | \ \ _| |_ / ____ \| |_) | |____| |____ ____) |
//      \_____|______\____/|____/_/    \_\______|     \/_/    \_\_|  \_\_____/_/    \_\____/|______|______|_____/ 
//                                                                                                                
// 

const dayNames = [
    "söndag",
    "måndag",
    "tisdag",
    "onsdag",
    "torsdag",
    "fredag",
    "lördag"
];

const monthNames = [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december"
];

const ManualSearchOffsetHour = 1;
const slot1_end = 17;
const slot2_end = 12;
const slot3_offset = 2;
const bedTime = 22;

const nowDate = new Date();
const nowHour = nowDate.getHours();
const nowMinute = nowDate.getMinutes();

const date = nowDate.getDate();
const weekday = nowDate.getDay();
const month = nowDate.getMonth();

const weekdayName = dayNames[weekday];
const monthName = monthNames[month];

const nowNumber = nowDate.getTime();

const dateString = nowDate.toISOString().substring(0,10);

const timeNowString = timeString(nowHour, nowMinute);

//      __  __ _____  _____  _____   ______ _    _ _   _  _____ _______ _____ ____  _   _  _____ 
//     |  \/  |_   _|/ ____|/ ____| |  ____| |  | | \ | |/ ____|__   __|_   _/ __ \| \ | |/ ____|
//     | \  / | | | | (___ | |      | |__  | |  | |  \| | |       | |    | || |  | |  \| | (___  
//     | |\/| | | |  \___ \| |      |  __| | |  | | . ` | |       | |    | || |  | | . ` |\___ \ 
//     | |  | |_| |_ ____) | |____  | |    | |__| | |\  | |____   | |   _| || |__| | |\  |____) |
//     |_|  |_|_____|_____/ \_____| |_|     \____/|_| \_|\_____|  |_|  |_____\____/|_| \_|_____/ 
//                                                                                               
//      

function timeString(hour, minute) {
    return String(hour).padStart(2, '0') + ":" + String(minute).padStart(2, '0');
}

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

//      ______                                         _       ____       _                        _______ _                      ____  
//     |  ____|                                       | |     |  _ \     | |                      |__   __(_)                    / /\ \ 
//     | |__ _   _ _ __   ___      _____   _____ _ __ | |_ ___| |_) | ___| |___      _____  ___ _ __ | |   _ _ __ ___   ___  ___| |  | |
//     |  __| | | | '_ \ / __|    / _ \ \ / / _ \ '_ \| __/ __|  _ < / _ \ __\ \ /\ / / _ \/ _ \ '_ \| |  | | '_ ` _ \ / _ \/ __| |  | |
//     | |  | |_| | | | | (__    |  __/\ V /  __/ | | | |_\__ \ |_) |  __/ |_ \ V  V /  __/  __/ | | | |  | | | | | | |  __/\__ \ |  | |
//     |_|   \__,_|_| |_|\___|    \___| \_/ \___|_| |_|\__|___/____/ \___|\__| \_/\_/ \___|\___|_| |_|_|  |_|_| |_| |_|\___||___/ |  | |
//                                                                                                                               \_\/_/ 
//        

// Function that takes array of events start and end times
// returns False if there are no events within the provided times
// returns True otherwise (if there are events between or during the provided times)
function eventsBetweenTimes(events, startHour, startMinute, endHour, endMinute, day){
    if (typeof day !== 'undefined') {
        var now = new Date(day);
    } else {
        var now = new Date();
    }

    const start = new Date(now.setHours(startHour,startMinute,0,0))
    const end = new Date(now.setHours(endHour,endMinute,0,0))

    //console.log(todaysEvents)

    for (var vevent of events) {
        const event = new ICAL.Event(vevent);
        const eventStartDate = event.startDate.toJSDate();
        const eventEndDate = event.endDate.toJSDate();
        //console.log(vevent)
        // console.log(event.summary)
        // console.log(eventStartDate)
        // console.log(eventEndDate)
        // console.log(start)
        // console.log(end)
        if ( ( eventStartDate >= start && eventStartDate < end ) || ( eventEndDate > start && eventEndDate < end ) || (eventStartDate <= start && eventEndDate >= end)) {
            console.log("Bokad!")
            return true
        }
    }
    return false
}

//      ______                             _ _______ _                 ____  
//     |  ____|                           | |__   __(_)               / /\ \ 
//     | |__ _   _ _ __   ___     ___  ___| |_ | |   _ _ __ ___   ___| |  | |
//     |  __| | | | '_ \ / __|   / __|/ _ \ __|| |  | | '_ ` _ \ / _ \ |  | |
//     | |  | |_| | | | | (__    \__ \  __/ |_ | |  | | | | | | |  __/ |  | |
//     |_|   \__,_|_| |_|\___|   |___/\___|\__||_|  |_|_| |_| |_|\___| |  | |
//                                                                    \_\/_/ 
//

// Sets the times to current ones in the HTML.
function setTime() {

    if (nowHour >= bedTime) {
        console.log("Läggdags!")
        document.body.innerHTML = "<h1>Klockan är " + timeNowString + ", gå och lägg dig!<h1>";
        return
    }

    document.getElementById("time_stamp").innerHTML = "Uppdaterat kl " + timeNowString;
    document.getElementById("title").innerHTML = "Obokade datorsalar i A-huset idag, " + weekdayName + " den " + date + " " + monthName + ":";

    document.getElementById("start-date").valueAsNumber = nowNumber;
    document.getElementById("start-time").value = timeNowString;
    let timeStringEnd = timeString(nowHour+ManualSearchOffsetHour, nowMinute);
    document.getElementById("end-time").value = timeStringEnd;

    return true
}

//      ______                                                      _  _____                     _      ____  
//     |  ____|                                                    | |/ ____|                   | |    / /\ \ 
//     | |__ _   _ _ __   ___     _ __ ___   __ _ _ __  _   _  __ _| | (___   ___  __ _ _ __ ___| |__ | |  | |
//     |  __| | | | '_ \ / __|   | '_ ` _ \ / _` | '_ \| | | |/ _` | |\___ \ / _ \/ _` | '__/ __| '_ \| |  | |
//     | |  | |_| | | | | (__    | | | | | | (_| | | | | |_| | (_| | |____) |  __/ (_| | | | (__| | | | |  | |
//     |_|   \__,_|_| |_|\___|   |_| |_| |_|\__,_|_| |_|\__,_|\__,_|_|_____/ \___|\__,_|_|  \___|_| |_| |  | |
//                                                                                                     \_\/_/ 
//    

// Trigger when the manual search button is pressed.
// Takes the inputs, makes a search and displays the result.
async function manualSearch() {
    console.log("Doing manual search!")

    // Get the halls
    let salar = await fetchJSONData();
    // Get the events for the halls
    salar = await getEvents(salar);

    const searchDate = document.getElementById("start-date");
    const startTime = document.getElementById("start-time");
    const endTime = document.getElementById("end-time");

    const searchStartTime = startTime.value;
    const searchEndTime = endTime.value;

    if (searchEndTime <= searchStartTime) {
        alert("Starttiden måste vara innan sluttiden.");
        console.log("Konstigt val av tider")
        return
    }

    const searchStartHour = searchStartTime.split(":")[0];
    const searchStartMinute = searchStartTime.split(":")[1];

    const searchEndHour = searchEndTime.split(":")[0];
    const searchEndMinute = searchEndTime.split(":")[1];

    const searchDateString = searchDate.value;

    let unbooked_manual = unBooked(salar, searchDateString, searchStartHour, searchStartMinute, searchEndHour, searchEndMinute);
    setHallsManual(4,unbooked_manual,searchStartHour, searchStartMinute, searchEndHour, searchEndMinute, searchDateString)
}

//      ______                               _   ______               _        ____  
//     |  ____|                             | | |  ____|             | |      / /\ \ 
//     | |__ _   _ _ __   ___      __ _  ___| |_| |____   _____ _ __ | |_ ___| |  | |
//     |  __| | | | '_ \ / __|    / _` |/ _ \ __|  __\ \ / / _ \ '_ \| __/ __| |  | |
//     | |  | |_| | | | | (__    | (_| |  __/ |_| |___\ V /  __/ | | | |_\__ \ |  | |
//     |_|   \__,_|_| |_|\___|    \__, |\___|\__|______\_/ \___|_| |_|\__|___/ |  | |
//                                 __/ |                                      \_\/_/ 
//                                |___/                                              

// For a list of halls it gets the ICAl events for that hall and stores it in the object
async function getEvents(salar) {
    //console.log(salar)
    for (var sal of salar) {
        //console.log(sal.url)
        var jcalData = await getData(sal.url)
        let comp = new ICAL.Component(jcalData);
        let vevents = comp.getAllSubcomponents("vevent");
        sal.events = vevents;
    }
    return salar
}

//      ______                               _ _______ _     _     _____                  ______               _        ____  
//     |  ____|                             | |__   __| |   (_)   |  __ \                |  ____|             | |      / /\ \ 
//     | |__ _   _ _ __   ___      __ _  ___| |_ | |  | |__  _ ___| |  | | __ _ _   _ ___| |____   _____ _ __ | |_ ___| |  | |
//     |  __| | | | '_ \ / __|    / _` |/ _ \ __|| |  | '_ \| / __| |  | |/ _` | | | / __|  __\ \ / / _ \ '_ \| __/ __| |  | |
//     | |  | |_| | | | | (__    | (_| |  __/ |_ | |  | | | | \__ \ |__| | (_| | |_| \__ \ |___\ V /  __/ | | | |_\__ \ |  | |
//     |_|   \__,_|_| |_|\___|    \__, |\___|\__||_|  |_| |_|_|___/_____/ \__,_|\__, |___/______\_/ \___|_| |_|\__|___/ |  | |
//                                 __/ |                                         __/ |                                 \_\/_/ 
//                                |___/                                         |___/                                         

// For a list of events and a specific days this function returns the events that occur that day.
function getThisDaysEvents(vevents, day) {

    const thisday = new Date(day);
    thisday.setHours(0, 0, 0, 0);

    //console.log(thisday)

    const thisDaysEvents = vevents.filter(vevent => {
        const event = new ICAL.Event(vevent);
        const eventDate = event.startDate.toJSDate();
        
        // Reset time to midnight to compare just the calendar day
        eventDate.setHours(0, 0, 0, 0);
        //console.log("Event date: " + eventDate)
        //console.log("This day:   " + thisday)

        // if (eventDate.getTime() === thisday.getTime()) {
        //     console.log("Samma dag!!!!!")
        // }

        return eventDate.getTime() === thisday.getTime();
    });
    return thisDaysEvents
}

//      ______                                ____              _            _  ____  
//     |  ____|                              |  _ \            | |          | |/ /\ \ 
//     | |__ _   _ _ __   ___     _   _ _ __ | |_) | ___   ___ | | _____  __| | |  | |
//     |  __| | | | '_ \ / __|   | | | | '_ \|  _ < / _ \ / _ \| |/ / _ \/ _` | |  | |
//     | |  | |_| | | | | (__    | |_| | | | | |_) | (_) | (_) |   <  __/ (_| | |  | |
//     |_|   \__,_|_| |_|\___|    \__,_|_| |_|____/ \___/ \___/|_|\_\___|\__,_| |  | |
//                                                                             \_\/_/ 
//        

// Takes an array of hall objects, the search date, start and end times.
// For each hall it check if that hall is booked between those times.
// Returns a list of halls that are NOT booked.
function unBooked(salar, searchDateString, startHour, startMinute, endHour, endMinute) {
    let res = [];
    
    for (let sal of salar) {
        //console.log(sal.name)
        let thisDaysEvents = getThisDaysEvents(sal.events, searchDateString);
        //console.log(thisDaysEvents)
        if (thisDaysEvents.length == 0) {
            res.push(sal)
        } else {
            if (!eventsBetweenTimes(sal.events, startHour, startMinute, endHour, endMinute, searchDateString)) {
                res.push(sal)
            }
        }
    }
    return res
}

//      ______                    _ _     _   _    _       _ _      ____  
//     |  ____|                  | (_)   | | | |  | |     | | |    / /\ \ 
//     | |__ _   _ _ __   ___    | |_ ___| |_| |__| | __ _| | |___| |  | |
//     |  __| | | | '_ \ / __|   | | / __| __|  __  |/ _` | | / __| |  | |
//     | |  | |_| | | | | (__    | | \__ \ |_| |  | | (_| | | \__ \ |  | |
//     |_|   \__,_|_| |_|\___|   |_|_|___/\__|_|  |_|\__,_|_|_|___/ |  | |
//                                                                 \_\/_/ 
//  

// Takes a list of halls and turns them into a HTML displayable list.
function listHalls(halls) {
    let innerHtmlString = "";
    if (halls.length == 0) {
        innerHtmlString = innerHtmlString + "<p>Inga lediga salar denna tid! :(</p>";
    }else {
        innerHtmlString = innerHtmlString + "<p>";
        for (let hall of halls) {
            innerHtmlString = innerHtmlString + '<a href="' + hall.karta + '" target="_blank" style="color:blue;">' + hall.name + '</a>' + "<br>";
        }
        innerHtmlString = innerHtmlString + "</p>";
    }
    return innerHtmlString;
}

//      ______                             _   _    _       _ _      ____  
//     |  ____|                           | | | |  | |     | | |    / /\ \ 
//     | |__ _   _ _ __   ___     ___  ___| |_| |__| | __ _| | |___| |  | |
//     |  __| | | | '_ \ / __|   / __|/ _ \ __|  __  |/ _` | | / __| |  | |
//     | |  | |_| | | | | (__    \__ \  __/ |_| |  | | (_| | | \__ \ |  | |
//     |_|   \__,_|_| |_|\___|   |___/\___|\__|_|  |_|\__,_|_|_|___/ |  | |
//                                                                  \_\/_/ 
//  

// For a select slot and a list of halls it displays the halls.
function setHalls(slot,halls,startHour, startMinute, endHour, endMinute) {
    let slotDiv = document.getElementById("Slot_" + slot)
    let innerHtmlString = "<h3>" + timeString(startHour, startMinute) + " - " + timeString(endHour, endMinute) + ":</h3>";

    innerHtmlString = innerHtmlString + listHalls(halls) + "<hr>";
    
    slotDiv.innerHTML = innerHtmlString;
}

// Same thing but special for the manual search feature, it displays a bit different
function setHallsManual(slot,halls,startHour, startMinute, endHour, endMinute, searchDateString) {
    let slotDiv = document.getElementById("Slot_" + slot)
    let innerHtmlString = "<h4>Obokade datorsalar " + searchDateString + ",<br>kl: " + timeString(startHour, startMinute) + " till " + timeString(endHour, endMinute) + ":</h4>";

    innerHtmlString = innerHtmlString + listHalls(halls);
    
    slotDiv.innerHTML = innerHtmlString;
}

//      ______                                    _        ____  
//     |  ____|                                  (_)      / /\ \ 
//     | |__ _   _ _ __   ___     _ __ ___   __ _ _ _ __ | |  | |
//     |  __| | | | '_ \ / __|   | '_ ` _ \ / _` | | '_ \| |  | |
//     | |  | |_| | | | | (__    | | | | | | (_| | | | | | |  | |
//     |_|   \__,_|_| |_|\___|   |_| |_| |_|\__,_|_|_| |_| |  | |
//                                                        \_\/_/ 
// 

async function main() {
    let res = setTime();
    if (res == undefined) {
        console.log("Terminating") // Avslutar om läggdags, (sparar ström eco-mode)
        return
    }

    // Monitoring the manual search functionality
    document.getElementById("search-button").addEventListener("click", manualSearch);

    // Get the halls
    let salar = await fetchJSONData();
    // Get the events for the halls
    salar = await getEvents(salar);

    if (nowHour < slot1_end) {
        let unbooked_slot1 = unBooked(salar, dateString, nowHour, nowMinute, slot1_end, 0);
        setHalls(1,unbooked_slot1,nowHour, 0, slot1_end, 0)
    } else {
        document.getElementById("Slot_1").innerHTML = "";
    }
    if (nowHour < slot2_end) {
        let unbooked_slot2 = unBooked(salar, dateString, nowHour, nowMinute, slot2_end, 0);
         setHalls(2,unbooked_slot2,nowHour, 0, slot2_end, 0)
    } else {
        document.getElementById("Slot_2").innerHTML = "";
    }
    let unbooked_slot3 = unBooked(salar, dateString, nowHour, nowMinute, nowHour+slot3_offset, 0);
    setHalls(3,unbooked_slot3,nowHour, 0, nowHour+slot3_offset, 0)
}

//       _____                       _       _     _        _____ _             _  ___   _      _      ___   ___ ___   __  
//      / ____|                     (_)     | |   | |  _   / ____| |           | |/ (_) (_)    | |    |__ \ / _ \__ \ / /  
//     | |     ___  _ __  _   _ _ __ _  __ _| |__ | |_(_) | |    | | __ _ ___  | ' /  __ _  ___| | __    ) | | | | ) / /_  
//     | |    / _ \| '_ \| | | | '__| |/ _` | '_ \| __|   | |    | |/ _` / __| |  <  / _` |/ __| |/ /   / /| | | |/ / '_ \ 
//     | |___| (_) | |_) | |_| | |  | | (_| | | | | |_ _  | |____| | (_| \__ \ | . \| (_| | (__|   <   / /_| |_| / /| (_) |
//      \_____\___/| .__/ \__, |_|  |_|\__, |_| |_|\__(_)  \_____|_|\__,_|___/ |_|\_\\__,_|\___|_|\_\ |____|\___/____\___/ 
//                 | |     __/ |        __/ |                                                                              
//                 |_|    |___/        |___/                                                                               
//      _   _             _             _ _             _           __  
//     | \ | |           | |           | (_)           | |       _  \ \ 
//     |  \| | ___    ___| |_ ___  __ _| |_ _ __   __ _| |      (_)  | |
//     | . ` |/ _ \  / __| __/ _ \/ _` | | | '_ \ / _` | |           | |
//     | |\  | (_) | \__ \ ||  __/ (_| | | | | | | (_| |_|       _   | |
//     |_| \_|\___/  |___/\__\___|\__,_|_|_|_| |_|\__, (_)      (_)  | |
//                                                 __/ |            /_/ 
//                                                |___/                 