// import {Mongo} from "meteor/mongo";
//
// export const PostTag = new Mongo.Collection('postTag');
//
// Meteor.methods({
//         "PostTagCollection.insert" (name, slug, postId) {
//             PostTag.insert({
//                     slug: slug,
//                     name: name,
//                     date: new Date(),
//                     postIds: [postId]
//                 }
//             )
//         },
//         "PostTagCollection.remove"(_id){
//             PostTag.remove(
//                 {_id: _id});
//         },
//         "PostTagCollection.addPostToTag"(_id, postId){
//             PostTag.update(
//                 {_id: _id}, {
//                     $addToSet: {
//                         "postIds": postId
//                     }
//                 });
//         },
//         "PostTagCollection.removePostFromTag"(id, postId){
//             PostTag.update(
//                 {_id: id}, {
//                     $pull: {
//                         "postIds": postId
//                     }
//                 });
//         }
//     }
// )
//
// if (Meteor.isServer) {
//     // Images.denyClient();
//     Meteor.publish('postTag', function () {
//         return PostTag.find();
//     });
// } else {
//     Meteor.subscribe('postTag');
// }