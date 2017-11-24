// import './recent-posts.html';
// import {Post} from "../../../startup/both/postCollection";
// import {formatDate} from "../../../helpers/formatdate";
// import {postSummary} from "../../../helpers/postsummary"
// if (Meteor.isClient) {
//     Session.setDefault("recentPostLandingPageData", "");
//     Template.recentPosts.onCreated(function () {
//         this.subscribe("post", function () {});
//     });
//
//     Template.recentPosts.helpers({
//         recentPostLandingPage : function () {
//             var posts = Post.find({}, {sort: {date: -1}, limit: 3}).fetch();
//             posts.forEach(function (item, index) {
//                 item.date = formatDate(item.date, false);
//                 item.content = postSummary(item.content);
//             });
//             return posts;
//         }
//     })
// }
