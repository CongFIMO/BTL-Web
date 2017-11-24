/*
Theme Name: Alioo - SEO Marketing HTML Template
Desciption: A unique & modern SEO Template for the SEO Services providers and SEO Marketers.
Theme URI: http://www.codingle.com/murtaxa/themeforest/alioo_demo
Author Name: Murtaxa
Author URI: http://www.codingle.com
Version: 1.0

*============================================
* Table of contents:
1. Preloader
2. Bootstrap Essentials
3. Adjust Header Menu On Scroll Down
4. Smooth Scrolling Effect
5. Stellar Js
6. Hero Parallax
7. Init Waypoint Js
8. On click hide collapse menu
9. Hero Carousel
10. Team Carousel
11. Ajax Contact Form
12. Blog Carousel
*============================================
*/
// On Window Load
$(window).load(function () {

    // 1. Preloader
    $('.preloader-area').fadeOut();
    $('.preloader-area').delay(350).fadeOut('slow');
    $('body').delay(550);

    // Counter Js
    $('.digit').counterUp({
        delay: 10,
        time: 1000
    });

});

// Document Ready Function
(function ($) {
    "use strict";

    // 2. Bootstrap Essentials
    $(".embed-responsive iframe").addClass("embed-responsive-item");
    $(".carousel-inner .item:first-child").addClass("active");
    $('[data-toggle="tooltip"]').tooltip();

    // 3. Adjust Header Menu On Scroll Down
    $(window).scroll(function () {
        var wScroll = $(this).scrollTop();
        var wh = $(window).height();
        if (wScroll > 40) {
            $(".topbar-area").addClass('dark-header-area');
            $(".topbar-area-lite").addClass('lite-header-area');
        } else {
            $(".topbar-area").removeClass('dark-header-area');
            $(".topbar-area-lite").removeClass('lite-header-area');
        }
        hero_parallax();
    });

    // 4. Smooth Scrolling Effect
    $('.smoothscroll').on('click', function (e) {
        e.preventDefault();
        var target = this.hash;
        var navHeight = $('.navbar-default').height();

        $('html, body').stop().animate({
            'scrollTop': $(target).offset().top - 80
        }, 1200);
    });

    // 5. Stellar Js
    $(window).stellar();

    // 6. Hero Parallax
    function hero_parallax() {
        var scrollPosition = $(window).scrollTop();
        $('.hero-content').css('margin-top', (-0 - (scrollPosition * .3)) + 'px');
    }

    // 7. Init Waypoint Js
    function onScrollInit(items, trigger) {
        items.each(function () {
            var osElement = $(this),
                osAnimationClass = osElement.attr('data-os-animation'),
                osAnimationDelay = osElement.attr('data-os-animation-delay');

            osElement.css({
                '-webkit-animation-delay': osAnimationDelay,
                '-moz-animation-delay': osAnimationDelay,
                'animation-delay': osAnimationDelay
            });

            var osTrigger = (trigger) ? trigger : osElement;

            osTrigger.waypoint(function (direction) {
                if (direction == "down") {
                    osElement.addClass('animated').addClass(osAnimationClass);
                }
            }, {
                    triggerOnce: true,
                    offset: '90%'
                });
        });
    }

    onScrollInit($('.way'));
    onScrollInit($('.staggered-animation'), $('.staggered-animation-container'));


    // 8. On click hide collapse menu
    $(".navbar-nav li a").on('click', function (event) {
        $(".navbar-collapse").removeClass("collapse in").addClass("collapse");
    });
    $(".dropdown-toggle").on('click', function (event) {
        $(".navbar-collapse").addClass("collapse in").removeClass("collapse");
    });

    // 9. Hero Carousel
    function hero_slider() {
        var owl = $("#hero-carousel");
        owl.owlCarousel({
            loop: true,
            margin: 30,
            responsiveClass: true,
            nav: false,
            navText: ["<i class='fa fa-angle-left'></i> ", "<i class='fa fa-angle-right'></i>"],
            items: 1,
            smartSpeed: 2000,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut',
            addClassActive: true,
            dots: false,
            autoplay: true,
            center: true,
            autoplayTimeout: 5000,
            mouseDrag: true,
            touchDrag: true,
            pullDrag: false,
            responsive: {}
        });
    }
    hero_slider();

    // 10. Team Carousel
    function team_slider() {
        var owl = $("#team-carousel");
        owl.owlCarousel({
            loop: true,
            margin: 30,
            responsiveClass: true,
            nav: false,
            navText: ["<i class='fa fa-angle-left'></i> ", "<i class='fa fa-angle-right'></i>"],
            items: 3,
            smartSpeed: 2000,
            addClassActive: true,
            dots: true,
            autoplay: true,
            center: true,
            autoplayTimeout: 5000,
            mouseDrag: true,
            touchDrag: true,
            pullDrag: false,
            responsive: {
                0: {
                    items: 1
                },
                767: {
                    items: 1
                },
                992: {
                    items: 3
                }
            }
        });
    }
    team_slider();

    // 11. Ajax Contact Form
    $('.cf-msg').hide();
    $('form#cf button#submit').on('click', function () {
        var fname = $('#fname').val();
        var subject = $('#subject').val();
        var email = $('#email').val();
        var website = $('#website').val();
        var msg = $('#msg').val();
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!regex.test(email)) {
            alert('Please enter valid email');
            return false;
        }

        fname = $.trim(fname);
        subject = $.trim(subject);
        email = $.trim(email);
        website = $.trim(website);
        msg = $.trim(msg);

        if (fname != '' && email != '' && msg != '') {
            var values = "fname=" + fname + "&subject=" + subject + "&email=" + email + "&website= " + website + " &msg=" + msg;
            $.ajax({
                type: "POST",
                url: "send-mail.php",
                data: values,
                success: function () {
                    $('#fname').val('');
                    $('#subject').val('');
                    $('#email').val('');
                    $('#website').val('');
                    $('#msg').val('');

                    $('.cf-msg').fadeIn().html('<div class="alert alert-success"><strong>Success!</strong> Email has been sent successfully.</div>');
                    setTimeout(function () {
                        $('.cf-msg').fadeOut('slow');
                    }, 4000);
                }
            });
        } else {
            $('.cf-msg').fadeIn().html('<div class="alert alert-danger"><strong>Warning!</strong> Please fillup the informations correctly.</div>')
        }
        return false;
    });
    // 12. blog-carousel
    $("#blog #blog-carousel").owlCarousel({
         loop: true,
         margin: 30,
         autoplay: true,
         nav: false,
         dots: false,
         responsive: {
             0: {
                 items: 1
             },
             300: {
                 items: 1
             },
             600: {
                 items: 2
             },
             900: {
                 items: 3
             },
             1200: {
                 items: 3
             }
         }
     });

})(jQuery);

