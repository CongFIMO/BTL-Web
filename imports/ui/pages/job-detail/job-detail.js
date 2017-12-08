import "./job-detail.html";
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {FlowRouter} from "meteor/kadira:flow-router";
import {BlazeLayout} from "meteor/kadira:blaze-layout";
import {Session} from "meteor/session";
import {Job} from "../../../startup/both/jobCollection.js";
import {JobCat} from "../../../startup/both/jobCatCollection";
import {messageLogSuccess} from "../../../partials/messages-success";
import Images from "../../../startup/both/images.collection.js";
import {splitURL} from "../../../helpers/splitURL";
import {formatDate} from "../../../helpers/formatdate";

Template.jobDetail.onCreated(function () {
    this.subscribe("users");
    var current = FlowRouter.current();
    var currentID = current.params.id;
    this.subscribe("jobs", function () {
        var check = Job.findOne({_id: currentID});
        if (!check) {
            FlowRouter.go('/job-list');
        }
    });
    Session.set('avatarSubscribeReady', false);
    this.subscribe("avatar", {
        onReady: function () {
            Session.set('avatarSubscribeReady', true);
        }
    });
    Session.setDefault("jobID", '');
    Session.setDefault("jobCatID", '');
    Session.setDefault("jobStatus", '');
    Session.setDefault("userAcceptedID", '');
    Session.setDefault("acceptCancel", '');
    Session.setDefault("multiDate", false);
    // Session.setDefault("check", check);
});
Template.jobDetail.onRendered(function () {
    jQuery(document).ready(function ($) {
        $('#homeAddress').gMap({
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

if (Meteor.isClient) {
    Template.jobDetail.helpers({
        'checkUserSlave': function () {
            var user = Meteor.user();
            var user_type = user && user.profile.user_type;
            if (user_type == 2) {
                return true;
            } else {
                return false;
            }
        },
        'jobInfoID': function () {
            // var jobID = FlowRouter.current().route;
            var current = FlowRouter.current();
            var currentID = current.params.id;
            if (currentID) {
                Session.set('jobID', currentID);
            }
        },
        'jobInfo': function () {
            var current = FlowRouter.current();
            var jobID = current.params.id;
            // var jobID = Session.get("jobID");
            // console.log(jobID);
            var job = Job.findOne({_id: jobID},
                {
                    fields:
                        {
                            _id: 1,
                            date_create: 1,
                            description: 1,
                            user_id: 1,
                            status: 1,
                            date_start: 1,
                            date_end: 1,
                            user_id_accepted: 1,
                            name: 1,
                            cat_id: 1,
                            // user_registered: 1,
                            home: 1,
                            'user.emails': 1,
                            'user.profile.full_name': 1,
                            'user.profile.avatar': 1,
                            'user.profile.phone': 1,
                            'user.profile.province': 1,
                            'user.profile.district': 1,
                            'user.profile.home_address': 1,
                            'user.profile.info': 1,
                        }
                }
            );
            var date_create = job && job.date_create;
            var user_id_accepted = job && job.user_id_accepted;
            var description = job && job.description;
            var name = job && job.name;
            // var time = job && job.time;
            var user_id_created_job = job && job.user_id;
            var date_start = job && job.date_start;
            var date_end = job && job.date_end;
            // var time_start = job && job.time_start;
            // var time_end = job && job.time_end;
            // var time_interval = job && job.time_interval;
            // var province = job && job.province;
            // var district = job && job.district;
            // var home = job && job.home;
            var email = job && job.user.emails;
            var full_name = job && job.user.profile.full_name;
            var avatar = job && job.user.profile.avatar;
            var phone = job && job.user.profile.phone;
            var info = job && job.user.profile.info;
            // var user_province = job && job.user.profile.province;
            // var user_district = job && job.user.profile.district;
            // var user_home_address = job && job.user.profile.home_address;

            var jobCatID = job && job.cat_id;
            var jobStatus = job && job.status;

            //stackoverflow.com/questions/29745873/hour-difference-between-two-timeshhmmss-ain-momentjs
            // description = postSummary(description);
            // user_registered = job && job.user_registered;

            Session.set('jobCatID', jobCatID);
            Session.set('jobStatus', jobStatus);

            var dateTme = new Date(date_create);
            // console.log(d);
            date_create = formatDate(dateTme);

            $("description").html(description);
            return {
                date_create,
                // description,
                user_id_created_job,
                date_start,
                name,
                date_end,
                user_id_accepted,
                avatar,
                email,
                full_name,
                phone,
                info,
                jobStatus
            }
        },
        'jobName': function () {
            // var currentUserId = Meteor.userId();
            var jobCatID = Session.get("jobCatID");
            var jobcat = JobCat.findOne({_id: jobCatID}, {fields: {name: 1}});
            return jobcat;
        },
        'listUser': function () {
            var jobID = Session.get("jobID");
            // console.log(jobID);
            var job = Job.findOne({_id: jobID},
                {fields: {status: 1, user_registered: 1, user_id_accepted: 1,}});
            var userRegistered = job && job.user_registered;
            var user_id_accepted = job && job.status === 'ACCEPTED' && job.user_id_accepted;
            // var user_id_accepted = job && job.user_id_accepted;
            return {
                userRegistered,
                user_id_accepted
            }

        },
        'statusJob': function (userIdAccepted) {
            // var jobstatus = Session.get('jobStatus');
            var jobID = Session.get("jobID");
            var job = Job.findOne({_id: jobID}, {fields: {status: 1, user_id_accepted: 1,}});
            var jobstatus = job && job.status;
            var user_id_accepted = job && job.user_id_accepted;

            if (jobstatus === 'ACCEPTED' && user_id_accepted === userIdAccepted) {
                return 'accepted bg-success highlighted';
            } else {
                return '';
            }
        },
        'checkStatusNotAccepted': function () {
            var jobID = Session.get("jobID");
            var job = Job.findOne({_id: jobID}, {fields: {status: 1,}});
            var jobstatus = job && job.status;
            if (jobstatus !== 'ACCEPTED') {
                return true;
            } else {
                return false;
            }
        },
        'checkUserInsideJobRegister': function () {
            var userID = Meteor.userId();
            var jobID = Session.get("jobID");
            var job = Job.findOne({_id: jobID}, {fields: {status: 1, user_registered: 1,}});
            var user_registered = job && job.user_registered;

            var found = false;
            if (user_registered) {
                user_registered.forEach(function (user) {
                    if (userID == user._id) {
                        // console.log('true');
                        found = true;
                    }
                    // console.log('false');
                });
            }
            return found;
        },
        'checkUserCreatedJob': function () {
            var currentUserID = Meteor.userId();
            var jobID = Session.get("jobID");
            var job = Job.findOne({_id: jobID}, {fields: {user_id: 1,}});
            var userIDCreatedJob = job && job.user_id;
            // console.log(userIDCreatedJob);
            if (userIDCreatedJob === currentUserID) {
                return true;
            } else {
                return false;
            }
        },
        'getAvatarUrl': function (userID) {
            // console.log(userID);
            if (Session.get('avatarSubscribeReady')) {
                if (userID !== undefined) {
                    var avatar = Images.findOne({userId: userID});
                    if(avatar !== undefined) {
                        avatar = avatar.link();
                    } else {
                        return '#';
                    }
                    avatar = splitURL(avatar).pathname;
                    // console.log("Link: " + avatar);
                    return avatar;
                } else {
                    return '#';
                }
            }
        },
        'userMilestone': function (userID) {
            // console.log(userID);
            var user = Meteor.users.findOne({_id: userID},
                {fields: {'milestone.job_accepted': 1, 'milestone.time_workerd': 1,}});
            var job_accepted = user && user.milestone.job_accepted;
            var time_workerd = user && user.milestone.time_workerd;
            return {
                job_accepted,
                time_workerd
            };
        },
        'formatDateTime': function (date) {
            var datetime = moment(date).format('DD-MM-YYYY');
            return datetime;
        },
        'isJobAccepted': function (jobStatus) {
            return jobStatus === 'ACCEPTED';
        },
        'isUserRented': function (userId, acceptedUserId, jobStatus) {
            // console.log("user id = " + userId + "/ accepted = " + acceptedUserId + "/ jobStatus= " + jobStatus);
            return (userId === acceptedUserId && jobStatus === 'ACCEPTED');
        },
        // 'multiDate' : function () {
        //     // console.log('multiDate => ',Session.get("multiDate"));
        //     if (Session.get("multiDate")){
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }
    });

    Template.cancelRegister.events({
        'click .cancel': function (event) {
            event.preventDefault();
            new Confirmation(
                {
                    message: "Bạn đang thực hiện hủy việc một việc đã đăng ký, tiếp tục chứ",
                    title: "Hủy việc đẵ đăng ký",
                    cancelText: "Huỷ",
                    okText: "Đồng ý",
                    success: true, // whether the button should be green or red
                    focus: "none" // which button to autofocus, "cancel" (default) or "ok", or "none"
                }, function (ok) {
                    // ok is true if the user clicked on "ok", false otherwise
                    // console.log(ok);
                    if (ok) {
                        // var acceptCancel = Session.get("acceptCancel");
                        var userID = Meteor.userId();
                        var jobID = Session.get("jobID");
                        var job = Job.findOne({_id: jobID},
                            {fields: {status: 1, user_registered: 1,}}
                        );
                        var user_registered = job && job.user_registered;

                        if (user_registered) {
                            user_registered.forEach(function (user, index) {
                                if (userID === user._id) {
                                    user_registered.splice(index, 1); // Remove user from list Job Register when submited Cancel
                                }
                            });
                            // Job.update({_id: jobID}, {$set: {user_registered: user_registered}});
                            Meteor.call("JobCollection.updateUserRegisteredList", jobID, user_registered);
                            Meteor.call("UAHCollection.insert", "job", doc._id, "Bạn đã hủy đăng kí công việc" );
                        }
                    } else {
                        Session.set("acceptCancel", 'cancel');
                        return false;
                    }
                }
            );
        },
    });

    Template.jobRegister.events({
        'submit form': function (event) {
            event.preventDefault();
            var currentUser = Meteor.user();

            var jobID = Session.get("jobID");

            Meteor.call("JobCollection.updateUserRegistered", jobID, currentUser);
            Meteor.call("UAHCollection.insert", "job", jobID, "Bạn đã đăng kí việc thành công" );
            messageLogSuccess('Đăng ký việc thành công');
            event.target.reset();
        },
    });

    Template.userRegisteredList.helpers({});

    Template.userRegisteredList.events({});
    Template.jobDetail.events({
        'click .accept-button': function () {
            var user_id_accepted = $(this)[0]._id;
            var jobID = Session.get("jobID");
            // Job.update({_id: jobID}, {$set: {user_id_accepted: user_id_accepted, status: 'ACCEPTED'}});
            Meteor.call("JobCollection.updateAcceptedUser", jobID, user_id_accepted);
            Meteor.call("UAHCollection.insert", "job", jobID, "Bạn đã chấp nhận người giúp việc" );

            Session.set('jobStatus', 'ACCEPTED');
            Session.set('userAcceptedID', user_id_accepted);
        }
    })
}
