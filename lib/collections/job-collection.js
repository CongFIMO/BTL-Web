import {Job} from "/imports/startup/both/jobCollection";
import {JobCat} from "/imports/startup/both/jobCatCollection";
import {UserActivityHistory} from "../../imports/startup/both/userActivityHistoryCollection";
import { Notifications } from "../../imports/startup/both/userNotifications.js";

if (Meteor.isServer) {
    // Job.after.insert(function (userID, doc) {
    //     var jobCat = JobCat.findOne({_id: doc.cat_id});
    //     var catName = jobCat.name;
    //     var users = Meteor.users.find({jobcat: catName});
    //     users.forEach(function (user, index) {
    //         if(Roles.userIsInRole(user._id, ['admin'])){
    //             Meteor.call("JobCollection.updateUserRegistered",doc._id,user);
    //             console.log("Assign to :"+ user.profile.full_name);
    //         }
    //     })
    // });

    Job.before.remove(function (userId, doc) {
        if (!Meteor.userId()) {
            console.log("prevent delete job successfully");
            throw new Meteor.Error(0, 'not-allowed');
        }
    });
    Job.after.remove(function (userId, doc) {
        Meteor.call("UAHCollection.remove", doc._id );
        Meteor.call("notifications.remove", doc._id);
    });

    Job.before.insert(function (userId, doc) {
        if (!Meteor.userId()) {
            // console.log("prevent delete job successfully");
            throw new Meteor.Error(0, 'not-allowed');
        }
    });
    Job.before.update(function (userId, doc) {
        console.log("doc.status = " + doc.status);
        if (doc.status==="asl;dkoqwedopqwie"){
            throw new Meteor.Error(0, 'not-allowed');
        }
    })
}
if (Meteor.isClient) {
    Job.after.insert(function (userId, doc) {
        if (!doc)
            return;
        // var jobCat = JobCat.findOne({_id: doc.cat_id});
        // var catName = jobCat.name;
        // var users = Meteor.users.find({jobcat: catName});
        // users.forEach(function (user, index) {
        //     if(Roles.userIsInRole(user._id, ['admin'])){
        //         Meteor.call("JobCollection.updateUserRegistered",doc._id,user);
        //         console.log("Assign to :"+ user.profile.full_name);
        //     }
        // })
        Meteor.call("UAHCollection.insert", "job", doc._id, "Bạn đã tạo công việc thành công" );
    });
}