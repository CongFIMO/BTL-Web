import './contact.html';

Template.contact.onCreated(function () {

});

Template.contact.onRendered(function () {
    // $.getScript("http://maps.google.com/maps/api/js?sensor=true");
    // $.getScript("private/jquery.gmaps.min.js");
    jQuery(document).ready(function ($) {
        $('#googlemaps').gMap({
            maptype: 'ROADMAP',
            scrollwheel: false,
            zoom: 13,
            markers: [
                {
                    address: 'New York, 45 Park Avenue', // Your Address Here
                    html: '<strong>Our Office</strong><br>45 Park Avenue, Apt. 303 </br>New York, NY 10016 ',
                    popup: true,
                }
            ],
        });

    });
});