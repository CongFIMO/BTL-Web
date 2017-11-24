// import {Meteor} from "meteor/meteor";
// import {PostTag} from "../../../startup/both/postTagCollection";
// import {Post} from "../../../startup/both/postCollection";
// import "./tag.html";
// if (Meteor.isClient) {
//     Template.tag.onCreated(function () {
//         this.subscribe("post");
//     })
//     Template.tag.helpers({
//         'tagData': function () {
//             let current = FlowRouter.current();
//             let slug = current.params.slug;
//             console.log("slug: "+ slug);
//             let postIds = [];
//             let tag = PostTag.findOne(
//                 {
//                     slug: slug
//                 },
//                 {}
//             );
//             postIds = tag.postIds;
//             console.log("slug: "+ slug);
//             let postTitles=[];
//             let posts = Post.find(
//                 {
//                     id: {
//                         $in: postIds
//                     }
//                 }
//             );
//             posts.forEach(function (element) {
//                 postTitles.push(
//                     {title: element.title, id: element.id}
//                     );
//             });
//             return {
//                 postTitles: postTitles,
//                 tagName: tag.name
//             };
//         },
//     });
// }