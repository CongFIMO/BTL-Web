// import "./post-page.html";
// import {Meteor} from "meteor/meteor";
// import {FlowRouter} from 'meteor/kadira:flow-router';
// import {Post} from "../../../startup/both/postCollection";
// import {formatDate} from "../../../helpers/formatdate";
// import {Cmt} from "../../../startup/both/comment";
// import {BlazeLayout} from 'meteor/kadira:blaze-layout';
//
// const crypto = require("crypto");
// const record_per_page = 5;
//
// if (Meteor.isClient) {
//     // var skipCount = 1;
//
//     Session.setDefault("currentPostData", '');
//     Template.post_page.onCreated(function () {
//         let current = FlowRouter.current();
//         let postID = current.params.postId;
//
//         this.subscribe("post", function () {
//             let postData = Post.findOne({id: postID});
//             //check post whether exist or not
//             if (!postData) {
//                 alert("Bài viết không tồn tại!");
//                 window.location.replace('/');
//             }
//             else {
//                 Session.set("currentPostData", postData);
//                 //update number of view
//                 Meteor.call("postCollection.increaseNumberOfView", postData._id );
//             }
//         });
//     });
//     Template.post_page.helpers({
//             'postData': function () {
//                 let postData = Session.get("currentPostData");
//                 if (!postData)
//                     return;
//                 let formattedDate = formatDate(postData.date);
//                 // console.log(postData);
//
//                 let tagNames = [], categoryNames = [];
//                 postData.tags.forEach(function (element) {
//                     tagNames.push(element.name);
//                 });
//                 postData.categories.forEach(function (element) {
//                     categoryNames.push(element.name);
//                 });
//
//                 $('#post_content').html(postData.content);
//
//                 return {
//                     title: postData && postData.title,
//                     date: postData && formattedDate,
//                     // numberOfComment: postData & postData.comments.length,
//                     tags: postData && postData.tags,
//                     categories: postData && postData.categories,
//                     content: postData && postData.content,
//                     author: postData && postData.author,
//                     authorId: postData && postData.authorId,
//                     id: postData && postData.id,
//                     featuredImage: postData && postData.featuredImage
//                 };
//             },
//             isOwner: function (authorId) {
//                 if (authorId === Meteor.user()._id)
//                     return true;
//                 return false;
//             },
//             numberOfComments: function () {
//                 return Counts.get('cmtCount');
//             }
//         }
//     )
//     Template.Postshow.helpers({
//         'checkUserLogin': function () {
//             console.log(Meteor.user());
//             if (Meteor.user()) {
//                 return true;
//             } else {
//                 return false;
//             }
//         }
//     });
//     // Template.showcmt.onCreated(function () {
//     //     var template = this;
//     //     let postData = Session.get("currentPostData");
//     //     if (!postData)
//     //         return;
//     //     template.autorun(function () {
//     //         var currentPage = parseInt(FlowRouter.current().params.page) || 1;
//     //         skipCount = (currentPage - 1) * record_per_page;
//     //         template.subscribe('cmtPage', skipCount, postData.id);
//     //     });
//     // })
//
//     Template.showcmt.helpers({
//         'comments': function () {
//             let postData = Session.get("currentPostData");
//             if (!postData)
//                 return;
//
//             console.log( postData);
//
//             let data = Cmt.find(
//                 {postID: postData.id},
//                 {
//                     sort: {
//                         date: -1
//                     }
//                 }
//             );
//             // console.log("cmt data " + data);
//             return data;
//         }
//         // prevPage: function () {
//         //     var previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
//         //     let postData = Session.get("currentPostData");
//         //     if (!postData)
//         //         return;
//         //     let id = postData.id;
//         //     return "/blog/" + id + "/page/" + previousPage;
//         // },
//         // nextPage: function () {
//         //     // var currentPage = parseInt(FlowRouter.current().params.page) || 1;
//         //     var nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
//         //     let postData = Session.get("currentPostData");
//         //     if (!postData)
//         //         return;
//         //     let id = postData.id;
//         //     return "/blog/" + id + "/page/" + nextPage;
//         // }
//
//     });
//
//     // Template.showcmt.onRendered(function () {
//     //     $(document).ready(function () {
//     //         var cmtCount = Counts.get('cmtCount');
//     //         if (currentPage() === 1) {
//     //             $('#prevPage').hide();
//     //             console.log('currentpage =' + currentPage());
//     //         }
//     //         if (currentPage() === getNumberOfPage() ) {
//     //             $('#nextPage').hide();
//     //             console.log('currentpage = last');
//     //         }
//     //         console.log("number of pages:"+ getNumberOfPage());
//     //     })
//     // });
//
//
//     Template.comment.events({
//         'submit form': function () {
//             event.preventDefault();
//             var Comment = event.target.comment.value;
//             if (Comment === '') {
//                 alert("Enter Comment!");
//                 return;
//             }
//             // var currentUserId = Meteor.userId();
//             let postData = Session.get("currentPostData");
//             if (!postData)
//                 return;
//             Meteor.call("CommentCollection.insert", Comment, postData.id);
//             event.target.comment.value = "";
//         },
//
//     });
//     let id = "";
//
//
//     Template.showcmt.events({
//         // "click .goPage": function () {
//         //     BlazeLayout.reset();
//         // },
//
//         'submit .form-cmt': function () {
//             event.preventDefault();
//             const name = event.target.name.value;
//
//             // Insert a task into the collection
//             // Cmt.update(this._id, {
//             //     $set: {name: name},
//             // });
//             Meteor.call("CommentCollection.updateName", this._id, name);
//         },
//
//         'submit .form-rep': function () {
//             event.preventDefault();
//             const name = event.target.name.value;
//             console.log("name: " + name);
//
//             Meteor.call("CommentCollection.updateName", this._id, name);
//         },
//
//         'click .btn-rep': function () {
//             event.preventDefault();
//
//             if (Meteor.user()) {
//                 id = crypto.randomBytes(16).toString("hex");
//                 var textRep = document.createElement("textarea");
//                 textRep.id = 'Txt-rep' + id;
//                 textRep.className = "reps";
//                 // textRep.style.marginRight = "100px";
//                 //var mode = document.getElementById("rep_"+this._id).value;
//
//                 document.getElementById("save_" + this._id).style.display = "block";
//                 document.getElementById("form_cmt_" + this._id).appendChild(textRep);
//
//                 document.getElementById("rep_" + this._id).disabled = true;
//                 // textRep.id = textRep.id+'1';
//                 // $('.reps').attr('id');
//                 // document.getElementById("rep_"+this._id).textContent="Save";
//                 // document.getElementById("rep_"+this._id).value="save";
//             }
//             else {
//                 document.getElementById("rep_" + this._id).disabled = true;
//             }
//         },
//         'click .btn-save': function () {
//             event.preventDefault();
//             if (document.getElementById("Txt-rep" + id).value == "") {
//                 document.getElementById("loicmt_" + this._id).innerHTML = "Bạn chưa nhập bình luận !!"
//             } else {
//                 let val = $("#Txt-rep" + id).val();
//
//                 Meteor.call("CommentCollection.addReplyToComment", this._id, val, id);
//                 document.getElementById("save_" + this._id).style.display = "none";
//                 document.getElementById("Txt-rep" + id).style.display = "none";
//                 document.getElementById("loicmt_" + this._id).innerHTML = "";
//                 document.getElementById("rep_" + this._id).disabled = false;
//             }
//         }
//
//     });
//
// }