// import {Mongo} from "meteor/mongo";
//
// export const Post = new Mongo.Collection('post');
// import {slugifyString} from "../../../imports/helpers/slugifyString";
// Meteor.methods({
//     "postCollection.insert"(id, title, listTag, featuredImage, listCategory, content){
//         return Post.insert({
//             id: id,
//             title: title,
//             tags: listTag,
//             featuredImage: featuredImage,
//             categories: listCategory,
//             content: content,
//             date: new Date(),
//             author: Meteor.user().profile.full_name,
//             authorId: Meteor.user()._id,
//             numberOfView: 1
//         });
//
//
//     },
//     "postCollection.increaseNumberOfView"(postID){
//         return Post.update({id: postID}, {$inc: {numberOfView: 1}});
//     },
//     "postCollection.addCategoryToPost"(postID, name){
//         return Post.update(
//             {
//                 id: postID,
//             }, {
//                 $addToSet: {
//                     "categories": {
//                         slug: slugifyString(name),
//                         name: name
//                     }
//                 }
//             });
//
//     },
//     "postCollection.addTagToPost"(postID, name){
//         return Post.update(
//             {id: postID}, {
//                 $addToSet: {
//                     "tags": {
//                         slug: slugifyString(name),
//                         name: name
//                     }
//                 }
//             });
//     },
//     "postCollection.removeCategoryFromPost"(postID, name){
//         return Post.update(
//             {id: postID}, {
//                 $pull: {
//                     "categories": {
//                         slug: slugifyString(name),
//                         name: name
//                     }
//                 }
//             });
//     },
//     "postCollection.removeTagFromPost"(postID, name){
//         return Post.update(
//             {id: postID}, {
//                 $pull: {
//                     "tags": {
//                         slug: slugifyString(name),
//                         name: name
//                     }
//                 }
//             });
//     },
//     "postCollection.updateMultipleInfo"(id, title, content, featuredImage){
//         return Post.update({id: id}, {
//             $set: {
//                 title: title,
//                 content: content,
//                 modified: new Date(),
//                 featuredImage: featuredImage
//             }
//         });
//     },
//     "postCollection.removePost"(id){
//         return Post.remove({id: id});
//     }
//
// })
// if (Meteor.isServer) {
//     // Images.denyClient();
//     Meteor.publish('post', function () {
//         return Post.find();
//     });
//     Meteor.publish('postPagination', function(skipCount) {
//         Counts.publish(this, 'postCount', Post.find(), {
//             noReady: true
//         });
//
//         return Post.find({}, {
//             sort: {date:-1},
//             limit: 5,
//             skip: skipCount
//         });
//     });
// } else {
//     // Meteor.subscribe('post');
// }
