// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/server/customPublishUserData.js';
import '/imports/startup/both/pubSubRoleUser.js';

import '/imports/startup/server/fixtures.js';
import '/imports/startup/both';
import './account-creation';
import './user-data-pubs';
import './smtp';

import "/imports/startup/both/images.collection";
// import "/imports/startup/both/jobCollection"; // Job
// import "/imports/startup/both/jobCatCollection"; // Job Category
// import "/imports/startup/both/jobTypeCollection"; // Job Type

import "/imports/startup/both/comment";
import "/imports/startup/both/featureImageCollection";
import "/imports/helpers/formatdate";
import "/lib/collections/job-cat"
import "/lib/collections/job-type"

import {Job} from "../imports/startup/both/jobCollection";
import {JobCat} from "../imports/startup/both/jobCatCollection";
import {JobType} from "../imports/startup/both/jobTypeCollection";
import {BrowserNotifications} from "../imports/startup/both/pushNotification";
import {Notifications} from "../imports/startup/both/userNotifications";
import  "../imports/startup/both/userCollection";

if (Meteor.isServer) {
    Job.after.insert(function (userID, doc) {
        var jobcat = JobCat.findOne({_id : doc.cat_id});
        var users = Meteor.users.find({},{sort:{score: -1}});
        // Push.Permission.GRANTED;
        // #####
        users.forEach((user, index) => {
            if (Roles.userIsInRole(user._id, ['slave'])) {

                var notificationContent = {
                    jobId: doc._id.insertedIds[0],
                    jobName: jobcat.name,
                    jobInfo: {
                        description: doc.description,
                        time: doc.time,
                        date_start: doc.date_start,
                        time_start: doc.time_start,
                        province: doc.province,
                        district: doc.district,
                        home: doc.home,
                        creator: doc.user.profile.full_name
                    },
                    jobPath: jobcat.slug,
                    userId: user._id,
                    userName: user.profile.full_name,
                    dateCreated: new Date()
                }
                Notifications.createNotification(notificationContent);
                BrowserNotifications.sendNotification({
                    userId: user._id,
                    title: user.profile.full_name + " đừng bỏ lỡ việc mới từ Giúp Việc Đây!",
                    icon: '/img/logo.png',
                    body: jobcat.name,
                    audio: '/audio/coins.mp3',
                    url: Meteor.absoluteUrl() + 'job/' + jobcat.slug + '/' + doc._id.insertedIds,
                    onClick: function () {
                        // window.focus();
                        window.open(Meteor.absoluteUrl() + jobcat.slug + '/' + doc._id.insertedIds + this, '_blank');
                        this.close();
                    }
                })
            }
        });
    });

    Job.after.update(function (userID, doc, fieldNames, methods) { // function (userID, doc, fieldNames, methods, forbidReplace)
        var jobcat = JobCat.findOne({_id : doc.cat_id});

        if (methods.$push !== undefined) {

            var notificationContent = {
                jobId: doc._id,
                jobName: jobcat.name,
                jobInfo: {
                    description: doc.description,
                    time: doc.time,
                    date_start: doc.date_start,
                    time_start: doc.time_start,
                    province: doc.province,
                    district: doc.district,
                    home: doc.home,
                    creator: doc.user.profile.full_name
                },
                jobPath: jobcat.slug,
                userId: doc.user_id,
                userName: doc.user.profile.full_name,
                dateCreated: new Date()
            };

            Notifications.createNotification(notificationContent);

            BrowserNotifications.sendNotification({
                userId: doc.user_id,
                title: 'Giúp Việc Đây',
                icon: '/img/logo.png',
                body: methods.$push.user_registered.profile.full_name + ' đã đăng ký việc của bạn!',
                audio: '/audio/coins.mp3',
                url: Meteor.absoluteUrl() + 'job/' + jobcat.slug + '/' + doc._id,
                onClick: function () {
                    // window.focus();
                    window.open(Meteor.absoluteUrl() + 'job/' + jobcat.slug + '/' + doc._id, '_blank');
                    this.close();
                }
            })
        }

        if ( doc.status == 'ACCEPTED') {
            // var users = Meteor.users.find({},{sort:{score: -1}});
            var users = doc.user_registered;
            var user_id_accepted = doc.user_id_accepted;
            var user_milestone = Meteor.users.findOne(
                { 
                    _id : user_id_accepted 
                }, 
                {
                    fields:
                    {
                        'milestone.job_accepted': 1,
                        'milestone.time_workerd': 1,
                    }
                }
            );
            var milestone = user_milestone.milestone;

           
            milestone.job_accepted = milestone.job_accepted + 1;
            milestone.time_workerd = milestone.time_workerd + parseInt(doc.time);
            
            

            Meteor.users.update(user_id_accepted, {$set: {milestone: milestone}});

            var message_accepted = " chúc mừng bạn đã được nhận!";
            var message_not_accepted = " đừng buồn hãy tìm một công việc khác nhé!";

            var url_accepted = Meteor.absoluteUrl() + 'job/' + jobcat.slug + '/' + doc._id;
            var url_not_accepted = Meteor.absoluteUrl() + 'job-list';

            users.forEach((user, index) => {
                if (Roles.userIsInRole(user._id, ['slave'])) {
                    BrowserNotifications.sendNotification({
                        userId: user._id,
                        title: (user_id_accepted === user._id) ? (user.profile.full_name + message_accepted) : (user.profile.full_name + message_not_accepted),
                        icon: '/img/logo.png',
                        audio: '/audio/coins.mp3',
                        url: (user_id_accepted === user._id) ? url_accepted : url_not_accepted,
                        onClick: function () {
                            // window.focus();
                            window.open((user_id_accepted === user._id) ? url_accepted : url_not_accepted, '_blank');
                            this.close();
                        }
                    })
                }
            });
        }
    });

}

