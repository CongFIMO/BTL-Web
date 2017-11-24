import {Mongo} from "meteor/mongo";

export const UserActivityHistory = new Mongo.Collection('userActivityHistory');

Meteor.methods({
        "UAHCollection.insert" (actionType, referId, description) {
            UserActivityHistory.insert({
                userId: Meteor.userId(),
                actionType: actionType,
                referId: referId,
                description: description,
                time_create: new Date()
            });
        },
        "UAHCollection.remove"(referId){
            UserActivityHistory.remove({referId: referId});
        }
    }
)
if (Meteor.isServer) {
    Meteor.publish('userActivityHistory', function () {
        return UserActivityHistory.find();
    });
    Meteor.publish('userActivityHistoryPagination', function (skipCount) {
        Counts.publish(this, 'uahCount', UserActivityHistory.find({userId: Meteor.userId()}), {
            noReady: true
        });
        return UserActivityHistory.find({userId: Meteor.userId()}, {
            sort: {
                time_create: -1,
            },
            limit: 10,
            skip: skipCount
        });
    });
} else {
    Tracker.autorun(function () {
        var routeName = FlowRouter.getRouteName();
        var params = FlowRouter.current().params;
        if (routeName && routeName === "App.profile" && params && params.section === "history") {
        }
        else Meteor.subscribe('userActivityHistory');
    });
}
