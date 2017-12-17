import {Job} from "/imports/startup/both/jobCollection";
import {UserActivityHistory} from "../../imports/startup/both/userActivityHistoryCollection";
import { Notifications } from "../../imports/startup/both/userNotifications.js";

if (Meteor.isServer) {
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
        if (doc.status==="ACCEPTED"){
            throw new Meteor.Error(0, 'not-allowed');
        }
    })
}
if (Meteor.isClient) {
    Job.after.insert(function (userId, doc) {
        if (!doc)
            return;
        Meteor.call("UAHCollection.insert", "job", doc._id, "Bạn đã tạo công việc thành công" );
    });
}