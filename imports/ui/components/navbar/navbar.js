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
            console.log("Meteor.logout();");
            Meteor.logout(function () {
                // var currentPath = FlowRouter.current().path;
                // console.log('Current Path: ' + currentPath);
                // if (currentPath === "/join") {
                // }
                FlowRouter.go('/join');

            });

        },
        'click #homeURL': function () {
            // document.location.reload(true);
            BlazeLayout.reset();
        },
    });

}