
const baseUrl = 'https://booking-api.mittvaccin.se/clinique/'
const daysIntervall = 20; //Dagar framåt att söka


const cliniques = [
    {'name': 'Nacksta', 'cliniqueId': '1291', 'appointmentType': '8853'},
    {'name': 'Nacksta restdos', 'cliniqueId': '1291', 'appointmentType': '17418'},
    {'name': 'Timrå', 'cliniqueId': '1311', 'appointmentType': '10620'},
    //{'name': 'Härnösand', 'cliniqueId': '1309', 'appointmentType': '12044'}
    //{'name': 'kramfors', 'cliniqueId': '1323', 'appointmentType': '9132'}  //bortkommenterad klinik
];


const dateFrom = toFormattedDateString(new Date());
const dateTo = toFormattedDateString(addDays(new Date(), daysIntervall));
const period = dateFrom+'-'+dateTo;
var skip = 0;

/*------------------------*/
function toFormattedDateString(date){
    return date.toISOString().substring(2, 10).replace(/[^0-9\.]+/g, "");
}
function addDays(date, days) {
    const calculatedDate = date;
    calculatedDate.setDate(date.getDate() + days);
    return calculatedDate;
}

function parse(data,clinique) {
    //console.log("parsing response from server.");
    let foundTime = false;
    $(data).each(function (i, d) {
        $(d.slots).each(function (i, da) {

            if (da.available == true) {
                console.log(new Date().toLocaleTimeString()+": Found a time at: "+ clinique.name);

                console.log(d.date+' '+da.when)
                let url = 'https://bokning.mittvaccin.se/klinik/'+clinique.cliniqueId+'/bokning';
                console.log("Boka här: "+ url);
                console.log("");
                notification(url, clinique.name);
                chrome.tabs.create({ url: url });
                foundTime = true; //break loop
               // reserveTime(clinique,d.date,da.when);
                if(skip == 0){
                    skip = 10;
                }
                return false;
            }
        });

        if(foundTime) return false; //Found a time, abort loop

    });
}



function execute() {
    console.log("executing");
    cliniques.forEach(function (clinique, i) {
            let url = baseUrl+clinique.cliniqueId+'/appointments/'+clinique.appointmentType+'/slots/'+period;

        $.ajax({
            type: "GET",
            url: url,
            ifModified: true, //get 200 and 304
            statusCode: {
                200: function(data, textStatus, jqXHR) {
                    parse(data, clinique);
                },
                304: function(responseObject, textStatus, errorThrown) {

                    //Nothing has changed
                   // console.log("No changes detected.");
                }
            }

        });
    });
}

console.log("Running..");

chrome.alarms.create("checkerAlarm", {
    delayInMinutes: 0,
    periodInMinutes: 0.08
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log("alarm larm");
    if(skip ==0 ){
        execute();
    } else{
        console.log("skipping: " + skip)
        skip--;
    }

});

function notification(url, text) {
    var opt = {
        type: "basic",
        title: "Ny Vaccintid",
        message: text

    }
    console.log("Making notification for "+url);
    chrome.notifications.create(url, opt);

}

