import {Meteor} from "meteor/meteor";
import {FlowRouter} from "meteor/kadira:flow-router";
import {BlazeLayout} from "meteor/kadira:blaze-layout";
import "./navbar.html";
import "../notifications/notifications.js";


if (Meteor.isClient) {
    Template.navbar.onRendered(function () {
        var instance = this;
        instance.autorun(function () {
            $('body').each(function () {
                $(this).contents().wrapAll('<div id="wrapper">');
            });
        });

        if (window.Notification) {
            if (Notification.permission != 'granted') {
                new Confirmation(
                    {
                        message: "Hãy bật nhận thông báo để cập nhật thông tin việc làm mới nhất từ Giúp Việc Đây!",
                        title: "Theo dõi Giúp Việc Đây",
                        cancelText: "Huỷ",
                        okText: "Đồng ý",
                        success: true, // whether the button should be green or red
                        focus: "none" // which button to autofocus, "cancel" (default) or "ok", or "none"
                    }, function (ok) {
                        // ok is true if the user clicked on "ok", false otherwise
                        // console.log(ok);
                        if (ok) {
                            Notification.requestPermission();
                        }
                    }
                );
            }
        }
    });

    Template.navbar.helpers({
        'isAdmin': function (currentUser) {
            // console.log(currentUser._id);
            // var user = Meteor.users.findOne({_id: currentUser._id});
            return Roles.userIsInRole(currentUser._id, ['admin']);
        },
        'isOwner': function (currentUser) {
            // var user = Meteor.users.findOne({_id: currentUser._id});
            // console.log(Roles.userIsInRole(currentUser._id, ['owner']));
            return Roles.userIsInRole(currentUser._id, ['owner']);
        },
        'isSlave': function () {

        }
    });

    Template.navbar.events({
        'click .logout': function (event) {
            event.preventDefault();
            //
            // console.log("Meteor.logout();");
            Meteor.logout(function () {
                var currentPath = FlowRouter.current().path;
                console.log('Current Path: ' + currentPath);
                if (currentPath === "/join") {
                    // document.location.reload(true);
                }
                // document.location.reload(true);

            });
        },
        'click #homeURL': function () {
            // document.location.reload(true);
            BlazeLayout.reset();
        },
    });

}