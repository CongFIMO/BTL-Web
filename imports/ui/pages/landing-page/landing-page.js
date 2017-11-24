import './landing-page.html';
import '../../layouts/banner/banner.js';
import '../../layouts/categories/categories.js';
import '../../layouts/testimonial/testimonial.js';
import '../../layouts/infobox/infobox.js';
import '../../layouts/recent-posts/recent-posts.js';
import '../../layouts/footer/footer.js';
import '../../layouts/script/script.js';

Template.landingPage.onCreated(function () {

});

Template.landingPage.onRendered(function () {
    var instance = this;
    instance.autorun(function () {
        $('body').each(function () {
            // $(this).contents().wrapAll('<div id="wrapper">');
        });
        $(document).ready(function() {
            $(window).bind("load", function() {
                var script = document.createElement("script");
                script.type="text/javascript";
                script.src = "/scripts/jquery-2.1.3.min.js";
                $("#scriptDiv").append(script);
                script.src = "/scripts/custom.js";
                $("#scriptDiv").append(script);
                script.src = "/scripts/jquery.superfish.js";
                $("#scriptDiv").append(script);
                script.src = "/scripts/jquery.themepunch.tools.min.js";
                $("#scriptDiv").append(script);
                script.src = "/scripts/jquery.themepunch.revolution.min.js";
                $("#scriptDiv").append(script);
                script.src = "/scripts/jquery.themepunch.showbizpro.min.js";
                $("#scriptDiv").append(script);
                script.src = "/scripts/jquery.flexslider-min.js";
                $("#scriptDiv").append(script);
                script.src = "/scripts/chosen.jquery.min.js";
                $("#scriptDiv").append(script);
                script.src = "/scripts/jquery.magnific-popup.min.js";
                $("#scriptDiv").append(script);
                script.src = "/scripts/waypoints.min.js";
                $("#scriptDiv").append(script);
                script.src = "/scripts/jquery.counterup.min.js";
                $("#scriptDiv").append(script);
                script.src = "/scripts/jquery.jpanelmenu.js";
                $("#scriptDiv").append(script);
                script.src = "/scripts/stacktable.js";
                $("#scriptDiv").append(script);
                script.src = "/scripts/headroom.min.js";
                $("#scriptDiv").append(script);
            });
        });
    });
});

