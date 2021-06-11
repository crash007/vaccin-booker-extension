
function parse(data,clinique) {
    $(data).each(function (i, d) {
        $(d.slots).each(function (i, da) {

            if (da.available == true) {
                console.log(new Date().toLocaleTimeString()+": Found a time at: "+ clinique.name);
                //console.log(da.when);
                console.log(d.date+' '+da.when)
                let url = 'https://bokning.mittvaccin.se/klinik/'+clinique.cliniqueId+'/bokning';
                console.log("Boka här: "+ url);
                console.log("");
                notification(url, clinique.name);
                chrome.tabs.create({ url: url });
            }
        });
    });
}

let baseUrl = 'https://booking-api.mittvaccin.se/clinique/'
let clinique1 = {'name': 'Nacksta', 'cliniqueId': '1291', 'appointmentType': '8853'};
let clinique2 = {'name': 'Timrå', 'cliniqueId': '1311', 'appointmentType': '10620'};
let clinique3 = {'name': 'Härnösand', 'cliniqueId': '1309', 'appointmentType': '12044'};
let clinique4 = {'name': 'kramfors', 'cliniqueId': '1323', 'appointmentType': '9132'};

let cliniques = [clinique1,clinique2,clinique3,clinique4];
var periods = ['210607-210613', '210614-210620', '210621-210627']
//cliniques.set('Nacksta', [baseUrl+'1291/appointments/8853/slots/210607-210613','https://booking-api.mittvaccin.se/clinique/1291/appointments/8853/slots/210614-210620','https://booking-api.mittvaccin.se/clinique/1291/appointments/8853/slots/210621-210627']);
//cliniques.set('Timra', ['https://booking-api.mittvaccin.se/clinique/1311/appointments/10620/slots/210607-210613', 'https://booking-api.mittvaccin.se/clinique/1311/appointments/10620/slots/210614-210620','https://booking-api.mittvaccin.se/clinique/1311/appointments/10620/slots/210621-210627']);
//cliniques.set('Harnosand', ['https://booking-api.mittvaccin.se/clinique/1309/appointments/12044/slots/210607-210613', 'https://booking-api.mittvaccin.se/clinique/1309/appointments/12044/slots/210614-210620', 'https://booking-api.mittvaccin.se/clinique/1309/appointments/12044/slots/210621-210627']);
//cliniques.set('kramfors', ['https://booking-api.mittvaccin.se/clinique/1323/appointments/9132/slots/210607-210613','https://booking-api.mittvaccin.se/clinique/1323/appointments/9132/slots/210614-210620', 'https://booking-api.mittvaccin.se/clinique/1323/appointments/9132/slots/210621-210627']);

function execute() {
    cliniques.forEach(function (clinique, i) {
        periods.forEach(function (p, i) {
            let url = baseUrl+clinique.cliniqueId+'/appointments/'+clinique.appointmentType+'/slots/'+p;

            $.get(url, function (data, textStatus, jqXHR) {  // success callback
                parse(data, clinique);
            });
        });
    });

}

console.log("Running..");

chrome.alarms.create("checkerAlarm", {
    delayInMinutes: 0,
    periodInMinutes: 0.2
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log("alarm larm");
   execute();
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
