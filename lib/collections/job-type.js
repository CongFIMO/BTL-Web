import {JobType} from "/imports/startup/both/jobTypeCollection";
import {Job} from "/imports/startup/both/jobCollection";
if (Meteor.isServer) {
    JobType.before.remove(function (userId, doc) {
        var jobT = doc._id;
        var search = Job.findOne({job_group: jobT});
        // console.log("doc._id= "+ jobT);
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.userId(), ["admin"])) {
            // console.log("prevent delete job successfully");
            throw new Meteor.Error(0, 'not-allowed');
        }
        if (search) {
            // console.dir("search= "+ search._id);
            // console.log("prevent delete jobT successfully");
            throw new Meteor.Error(0, 'not-allowed');
        }
    });
}