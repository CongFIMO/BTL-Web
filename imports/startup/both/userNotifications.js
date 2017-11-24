import { Mongo } from "meteor/mongo";
import {FlowRouter} from 'meteor/kadira:flow-router';

export const Notifications = new Mongo.Collection("notifications");



if (Meteor.isServer) {

    Meteor.methods({
        'notifications.markAll'(){
            Notifications.update({},{$set: { read: true}},{multi:true});
        },

        'notifications.remove'(jobId){
			Notifications.remove({jobId: jobId})
		}
    });

	Notifications.allow({
		update: function(userId, doc, fieldNames) {
			// return (
			// 	ownsDocument(userId, doc) &&
			// 	fieldNames.length === 1 &&
			// 	fieldNames[0] === "read"
			// );
			return true;
		}
	});

	Notifications.createNotification = function(content) {
		Notifications.insert({
			userId: content.userId,
			jobId: content.jobId,
			jobPath: content.jobPath,
			jobName: content.jobName,
			userName: content.userName,
			jobInfo: content.jobInfo,
			dateCreated: content.dateCreated,
			read: false
		});
	};

	Meteor.publish("notifications", function() {
		return Notifications.find();
	});

	Meteor.publish('notPage', function (skipCt, idNot) {
		Counts.publish(this, 'notCount', Notifications.find({userId:idNot}),{
			noReady:true
		} );
		return Notifications.find({userId:idNot},{
			sort: {
				dateCreated:-1
			},
			limit :10,
			skip : skipCt
		});
    });
}


if (Meteor.isClient) {
	Tracker.autorun(function () {
		var routeName = FlowRouter.getRouteName();
		// console.log("routename: " + routeName);
		if(routeName && routeName === "App.notification"){}
		else{
			Meteor.subscribe('notifications');
		}
		//Meteor.subscribe('notifications');
    })
}

// http://vi.discovermeteor.com/chapters/notifications/
