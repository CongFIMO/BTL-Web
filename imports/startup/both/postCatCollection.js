// // import {Mongo} from "meteor/mongo";
//
// export const PostCat = new Mongo.Collection('postCategory');
//
// Meteor.methods({
//         "PostCatCollection.insert" (name, slug, postId) {
//             PostCat.insert({
//                     slug: slug,
//                     name: name,
//                     date: new Date(),
//                     postIds: [postId]
//                 }
//             )
//         },
//         "PostCatCollection.remove"(_id){
//             PostCat.remove(
//                 {_id: _id});
//         },
//         "PostCatCollection.addPostToCat"(_id, postId){
//             PostCat.update(
//                 {_id: _id}, {
//                     $addToSet: {
//                         "postIds": postId
//                     }
//                 });
//         },
//         "PostCatCollection.removePostFromCat"(id, postId){
//             PostCat.update(
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
//     Meteor.publish('postCategory', function () {
//         return PostCat.find();
//     });
// } else {
//     Meteor.subscribe('postCategory');
// }
