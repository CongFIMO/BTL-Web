import {JobCat} from "/imports/startup/both/jobCatCollection";
import {JobType} from "/imports/startup/both/jobTypeCollection";

if (Meteor.isServer) {
    JobCat.before.remove(function (userId, doc) {
        var jobC = doc._id;
        var search = JobType.findOne({cat_id: jobC});
        // console.log(userId);
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.userId(), ["admin"])) {
            // console.log("prevent delete job successfully");
            throw new Meteor.Error(0, 'not-allowed');
        }
        // console.log("doc._id= "+ search);
        if (search) {
            // console.log("prevent delete jobCat successfully");
            throw new Meteor.Error(0, 'not-allowed');
        }
    });
}