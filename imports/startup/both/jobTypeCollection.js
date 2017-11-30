// import { Mongo } from 'meteor/mongo';
//
// export const JobType = new Mongo.Collection('jobtype');
//
// Meteor.methods({
//     "JobTypeCollection.insert"(jobTypeName, jobCatId){
//         JobType.insert({
//             name: jobTypeName,
//             date: new Date(),
//             cat_id: jobCatId
//         });
//
//     },
//     "JobTypeCollection.remove"(_id){
//         JobType.remove({_id: _id});
//     }
// })
// if (Meteor.isServer) {
//     // Images.denyClient();
//     Meteor.publish('jobtype', function () {
//         return JobType.find();
//     });
// } else {
//     Meteor.subscribe('jobtype');
// }