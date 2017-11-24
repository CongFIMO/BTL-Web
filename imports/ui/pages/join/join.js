import {Meteor} from 'meteor/meteor';
import './join.html';
import '../register/register.js';
import '../login/login.js';
import {FlowRouter} from "meteor/kadira:flow-router";
import {BlazeLayout} from "meteor/kadira:blaze-layout";
import {messageLogSuccess} from "../../../../imports/partials/messages-success";
import {messageLogError} from "../../../../imports/partials/messages-error";

var validateEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

// Custom handle register
if (Meteor.isClient) {
    Template.join.onRendered(function () {
        Session.setDefault("checkedUserType", 0);
        // $(function() {
        //     $('.tooltip-wrapper').tooltip({position: "bottom"});
        // });
        $(document).ready(function () {
            var $tabsNav = $('.tabs-nav'),
                $tabsNavLis = $tabsNav.children('li');
            $tabsNav.each(function () {
                var $this = $(this);
                $this.next().children('.tab-content').stop(true, true).hide().first().show();
                $this.children('li').first().addClass('active').stop(true, true).show();
            });
            $tabsNavLis.on('click', function (e) {
                var $this = $(this);
                $this.siblings().removeClass('active').end().addClass('active');
                $this.parent().next().children('.tab-content').stop(true, true).hide().siblings($this.find('a').attr('href')).fadeIn();
                e.preventDefault();
            });

            var hash = window.location.hash;
            var anchor = $('.tabs-nav a[href="' + hash + '"]');
            if (anchor.length === 0) {
                $(".tabs-nav li:first").addClass("active").show();
                $(".tab-content:first").show();
            } else {
//                console.log(anchor);
                anchor.parent('li').click();
            }
        });

        // Tool tip show when register
        $('body').tooltip({
            selector: '[rel="tooltip"]'
        });
        // $(".register input").focus(function () {
        //
        // });
        if (!Session.get("checkedUserType")) {
            console.log('Not Checked');
            $(".fill-value-register input").addClass("btn disabled");
            $(".fill-value-register input").attr(
                {
                    "disabled": true,
                    rel: "tooltip",
                    "data-title": "Bạn phải lựa chọn loại tài khoản đăng ký trước"
                }
            );
        }
    });

    Template.join.events({
        'submit form.register': function (event) {
            sAlert.closeAll();
            event.preventDefault();
            var emailVar = event.target.registerEmail.value;
            var passwordVar = event.target.registerPassword.value;
            var passwordAgainVar = event.target.registerAgainPassword.value;
            var fullNameVar = event.target.registerFullName.value;
            var userTypeRegisterVar = event.target.userTypeRegister.value;

            // Trim Helper
            var trimInput = function (val) {
                return val.replace(/^\s*|\s*$/g, "");
            };
            emailVar = trimInput(emailVar);
            // Check password is at least 6 chars long
            var isValidPassword = function (pwd, pwd2) {
                if (pwd === pwd2) {
                    if (pwd.length === 0) {
                        var $message = 'Mật khẩu không được để trống!';
                        messageLogError($message, 'flip', 'top');
                        return false;
                    }
                    if (pwd.length < 6) {
                        var $message = 'Mật khẩu quá ngắn!';
                        messageLogError($message, 'flip', 'top');
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    // console.log('Error');
                    var $message = "Xác nhận mật khẩu không khớp vui lòng thử lại!";
                    messageLogError($message, 'flip', 'top');
                }
            };
            // You must agree to the Terms of Use and Privacy Policy
            // console.log("Form submitted.");
            if (validateEmail(emailVar)) {
                if (isValidPassword(passwordVar, passwordAgainVar)) {
                    Accounts.createUser({
                        email: emailVar,
                        password: passwordVar,
                        full_name: fullNameVar,
                        user_type: userTypeRegisterVar
                    }, function (error) {
                        if (error) {
                            // console.log(error);
                            messageLogError(error.reason, 'flip', 'top');
                        } else {
                            var $message = 'Đăng ký thành công!!!';
                            messageLogSuccess($message, 'stackslide', 'top');
                            // FlowRouter.redirect('/');
                        }
                    });
                }
            } else {
                messageLogError('Định dạng Email chưa đúng', 'flip', 'top');
            }
        },
        // '.register form input:radio': function (event) {
        //     if (event.target) {
        //         console.log('AAAAAA');
        //     }
        // },
        'change .register input[name=userTypeRegister]:radio': function (event) {
            var val = event.currentTarget.value;
            if (val) {
                Session.set("checkedUserType", 1);
                // console.log('Checked');
                $(".fill-value-register input").attr("disabled", false);
                $(".fill-value-register input").removeClass("btn disabled");
                $(".fill-value-register input").removeAttr('rel');
                $(".fill-value-register input").removeAttr('data-title');
            }
            // console.log(val)
        },
    });
}