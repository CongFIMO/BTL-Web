import {Mongo} from 'meteor/mongo';

export const SeenJob = new Mongo.Collection('seenJob');
Meteor.methods({
    "SeenJobCollection.markRead"(jobId, userId){
        console.log(' markRead jobId= ' + jobId);
        console.log('markRead userId= ' + userId);
        SeenJob.update({
                jobId: jobId,
                userId: userId,
            }, {
                jobId: jobId,
                userId: userId,
            },
            {upsert: true});

    }, "SeenJobCollection.markAllRead"(userId,listType){
        console.log('markAllRead userId= ' + userId);
        SeenJob.update({
                userID: userId,
                listType: listType
            }, {
                userID: userId,
                read: 'allRead',
                listType: listType
            },
            {upsert: true});


    },
    "SeenJobCollection.markAllUnread"(userId,listType){
        console.log('markAllUnRead userId= ' + userId);
        SeenJob.update({
                userID: userId,
                listType: listType
            }, {
                userID: userId,
                read: 'allUnread',
                listType: listType
            },
            {upsert: true});

    },
    "SeenJobCollection.markNormal"(userId,listType){
        console.log('markNormal userId= ' + userId);
        SeenJob.update({
                userID: userId,
                listType: listType
            }, {
                userID: userId,
                read: 'normal',
                listType: listType
            },
            {upsert: true});

    },
    "SeenJobCollection.markUnread"(jobId, userId){
        console.log('jobId= ' + jobId);
        console.log('userId= ' + userId);
        SeenJob.remove(
            {
                jobId: jobId,
                userId: userId
            }
        );
    },
    "SeenJobCollection.removeAll"(userId){
        console.log('userId= ' + userId);
        SeenJob.remove(
            {
                userId: userId
            }
        );
    },

})
if (Meteor.isServer) {
    // Images.denyClient();
    Meteor.publish('SeenJob', function () {
        return SeenJob.find();
    });
} else {
    Meteor.subscribe('SeenJob');
}
