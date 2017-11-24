import { Mongo } from 'meteor/mongo';

export const JobCat = new Mongo.Collection('jobcat');
Meteor.methods({
    "JobCatCollection.insert"(jobCatName, slug){
        JobCat.insert({
            name: jobCatName,
            date: new Date(),
            slug: slug
        });

    },
    "JobCatCollection.remove"(_id){
        JobCat.remove({_id: _id});
    }
})
if (Meteor.isServer) {
    // Images.denyClient();
    Meteor.publish('jobcat', function () {
        return JobCat.find();
    });
} else {
    Meteor.subscribe('jobcat');
}
