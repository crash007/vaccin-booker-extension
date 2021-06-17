var skip = 0;
const baseUrl = 'https://booking-api.mittvaccin.se/clinique/'
const daysIntervall = 20; //Dagar framåt att söka

//let clinique2 = {'name': 'Nacksta', 'cliniqueId': '1291', 'appointmentType': '7359'}; //restdos
//let clinique3 = {'name': 'Timrå', 'cliniqueId': '1311', 'appointmentType': '10620'};
//let clinique3 = {'name': 'Härnösand', 'cliniqueId': '1309', 'appointmentType': '12044'};
//let clinique4 = {'name': 'kramfors', 'cliniqueId': '1323', 'appointmentType': '9132'};

const cliniques = [
    {'name': 'Nacksta', 'cliniqueId': '1291', 'appointmentType': '8853'},
    {'name': 'Nacksta restdos', 'cliniqueId': '1291', 'appointmentType': '17418'}
];



const dateFrom = toFormattedDateString(new Date());
const dateTo = toFormattedDateString(addDays(new Date(), daysIntervall));
const period = dateFrom+'-'+dateTo;

//cliniques.set('Nacksta', [baseUrl+'1291/appointments/8853/slots/210607-210613','https://booking-api.mittvaccin.se/clinique/1291/appointments/8853/slots/210614-210620','https://booking-api.mittvaccin.se/clinique/1291/appointments/8853/slots/210621-210627']);
//cliniques.set('Timra', ['https://booking-api.mittvaccin.se/clinique/1311/appointments/10620/slots/210607-210613', 'https://booking-api.mittvaccin.se/clinique/1311/appointments/10620/slots/210614-210620','https://booking-api.mittvaccin.se/clinique/1311/appointments/10620/slots/210621-210627']);
//cliniques.set('Harnosand', ['https://booking-api.mittvaccin.se/clinique/1309/appointments/12044/slots/210607-210613', 'https://booking-api.mittvaccin.se/clinique/1309/appointments/12044/slots/210614-210620', 'https://booking-api.mittvaccin.se/clinique/1309/appointments/12044/slots/210621-210627']);
//cliniques.set('kramfors', ['https://booking-api.mittvaccin.se/clinique/1323/appointments/9132/slots/210607-210613','https://booking-api.mittvaccin.se/clinique/1323/appointments/9132/slots/210614-210620', 'https://booking-api.mittvaccin.se/clinique/1323/appointments/9132/slots/210621-210627']);

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
    cliniques.forEach(function (clinique, i) {
            let url = baseUrl+clinique.cliniqueId+'/appointments/'+clinique.appointmentType+'/slots/'+period;
            $.get(url, function (data, textStatus, jqXHR) {  // success callback
                parse(data, clinique);
            });
        });
}

console.log("Running..");

chrome.alarms.create("checkerAlarm", {
    delayInMinutes: 0,
    periodInMinutes: 0.1
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


