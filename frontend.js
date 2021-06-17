
jQuery(document).ready(function () {

    let path = window.location.pathname;


    if(path.includes('1291')){
        /*setTimeout(function() {

            console.log('Nacksta');

            var vue = document.querySelector('#app').__vue__
            vue.$store.commit("setSelectedAppointmentType", {appType: 3184})
            vue.$store.commit("setBookingTimer", {
                bookingTimer: new Date().getTime()
            });

            vue.$router.push({name: "Booking2", params: {cliniqueId: 1291}});
        },2000);
        */

        console.log('Nacksta');
        setTimeout(function(){document.querySelectorAll('select')[0].selectedIndex = 2
            document.querySelectorAll('select')[0].dispatchEvent(new Event('change'))

        }
        , 500);
        setTimeout(function(){
            document.querySelectorAll('select')[1].selectedIndex = 1
            document.querySelectorAll('select')[1].dispatchEvent(new Event('change'))

        },600)
        setTimeout(function(){
            document.head.innerHTML += '<script>alert = function(){}</script>';
            window.alert=null;
            document.querySelector('.save').dispatchEvent(new Event('click'));

        },670);


    }

});

function populate(){
    document.querySelectorAll('select')[0].selectedIndex = 1
    document.querySelectorAll('select')[0].dispatchEvent(new Event('change'))
    document.querySelectorAll('select')[1].selectedIndex = 1
    document.querySelectorAll('select')[1].dispatchEvent(new Event('change'))
}
