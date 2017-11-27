import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Session } from "meteor/session";
import { ReactiveVar } from "meteor/reactive-var";
import { Job } from "../../../startup/both/jobCollection.js";
import { JobCat } from "../../../startup/both/jobCatCollection";
import { JobType } from "../../../startup/both/jobTypeCollection";
// import { Prov } from "../../../startup/both/province";
import "./job-created.html";

if (Meteor.isClient) {
    Template.jobCreated.onCreated(function () {
        this.subscribe("users");
        this.subscribe("roles");
    });
	Template.jobCreated.helpers({
        isOwner: function() {
            // Meteor.subscribe('roles');
            if (Template.instance().subscriptionsReady()) {
                if (Roles.userIsInRole(Meteor.userId(), ["admin", 'owner'])) {
                    // console.log('Owner');
                } else {
                    // console.log('Slave');
                    // FlowRouter.go('/');
                    // BlazeLayout.reset();
                }
            }

        },
		'formatDateTime': function (date) {
            return moment(date).format('DD-MM-YYYY');
        },
		'jobs': function() {
            var currentUserId = Meteor.userId();
            return Job.find({user_id: currentUserId},{sort: {date_create: -1}});
		},
		jobName: function(typeID) {
			var jobtype = JobType.findOne({_id : typeID },{fields : {name : 1}});
			var name = jobtype && jobtype.name;
			// console.log(name);
			return name;
		},
		catSlug: function(typeID) {
			var jobtype = JobType.findOne({_id : typeID },{fields : {name : 1, cat_id : 1}});
			// var name  = jobtype && jobtype.name;
			var cat_id = jobtype && jobtype.cat_id;
			// console.log(cat_id);
			var jobcat = JobCat.findOne({_id : cat_id },{fields : {name : 1, slug : 1}});
			// console.log(jobcat);
			var cat_slug = jobcat && jobcat.slug;
			// console.log(cat_slug);
			return cat_slug;
		},

	});
}
