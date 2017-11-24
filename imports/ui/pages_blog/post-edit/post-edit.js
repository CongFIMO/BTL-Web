// import "./post-edit.html";
// import {Meteor} from "meteor/meteor";
// import {slugifyString} from "../../../helpers/slugifyString";
// import {Post} from "../../../startup/both/postCollection";
// import {PostCat} from "../../../startup/both/postCatCollection";
// import {PostTag} from "../../../startup/both/postTagCollection";
// import FeaturedImages from "../../../startup/both/featureImageCollection.js";
// import {Template} from "meteor/templating";
// import {ReactiveVar} from "meteor/reactive-var";
// import {splitURL} from "../../../helpers/splitURL";
//
// if (Meteor.isClient) {
//     Session.setDefault("currentPostData", '');
//     let featuredImage = "";
//     Template.post_edit.onCreated(function () {
//         let current = FlowRouter.current();
//         let postID = current.params.postId;
//         this.subscribe("users");
//         this.subscribe("post", function () {
//             let postData = Post.findOne({id: postID});
//             if (!postData) {
//                 alert("Bài viết không tồn tại!");
//                 window.location.replace('/');
//             }
//             else {
//                 if (postData.authorId === Meteor.user()._id) {
//                     Session.set("currentPostData", postData);
//                 }
//                 else {
//                     alert("Bài viết này không phải của bạn!");
//                     window.location.replace('/');
//                 }
//             }
//         });
//         this.currentUpload = new ReactiveVar(false);
//     });
//     Template.post_edit.helpers({
//         currentUpload: function () {
//             return Template.instance().currentUpload.get();
//         },
//         "postData": function () {
//             let current = FlowRouter.current();
//             let postID = current.params.postId;
//             let postData = Post.findOne({id: postID});
//             // console.log(postData);
//             let tagNames = [], categoryNames = [];
//             postData.tags.forEach(function (element) {
//                 tagNames.push(element.name);
//             });
//             postData.categories.forEach(function (element) {
//                 categoryNames.push(element.name);
//             });
//             // console.log("tagNames= " + tagNames);
//             // console.log("categoryNames= " + categoryNames);
//             $("#summernote").summernote("code", postData.content);
//             $('#tokenfieldCategory').tokenfield('setTokens', categoryNames);
//             $('#tokenfieldTag').tokenfield('setTokens', tagNames);
//             $('#featured_image').attr("src", postData.featuredImage);
//             featuredImage = postData.featuredImage;
//             return {
//                 title: postData.title,
//                 postCats: categoryNames,
//                 postTags: tagNames
//             };
//         }
//     });
//     Template.post_edit.onRendered(function () {
//         $(document).ready(function () {
//             let current = FlowRouter.current();
//             let postID = current.params.postId;
//             $('#summernote').summernote({
//                 height: 300,                 // set editor height
//                 minHeight: null,             // set minimum height of editor
//                 maxHeight: null,
//             });
//             $('#tokenfieldCategory')
//                 .on('tokenfield:createtoken', function (e) {
//                     var data = e.attrs.value.split('|');
//                     e.attrs.value = data[1] || data[0];
//                     e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0]
//                     // console.log(e.attrs.value);
//                 })
//                 .on('tokenfield:createdtoken', function (e) {
//                     //if category exists, add postId to postIds of category
//                     //if not, create category
//                     let doc = PostCat.findOne({
//                         'slug': slugifyString(e.attrs.value)
//                     });
//                     if (!doc) {
//                         Meteor.call("PostCatCollection.insert", e.attrs.value, slugifyString(e.attrs.value), postID);
//                     } else {
//                         Meteor.call("PostCatCollection.addPostToCat", doc._id, postID);
//                     }
//                     //add category to category list of post
//                     let postWithCategory = Post.findOne({
//                         id: postID, categories: {
//                             $in: [{
//                                 slug: slugifyString(e.attrs.label),
//                                 name: e.attrs.label
//                             }]
//                         }
//                     });
//                     if (!postWithCategory) {
//                         Meteor.call("postCollection.addCategoryToPost", postID, e.attrs.label);
//
//                     }
//                     else {
//                     }
//                 })
//                 .on('tokenfield:edittoken', function (e) {
//                     let doc = PostCat.findOne({
//                         'slug': slugifyString(e.attrs.label),
//                         'name': e.attrs.label
//                     });
//                     //remove post from category
//                     if (doc) {
//                         Meteor.call("PostCatCollection.removePostFromCat", doc._id, postID);
//                     }
//                     //remove category from tag
//                     Meteor.call("postCollection.removeCategoryFromPost", postID, e.attrs.label);
//                 })
//                 .on('tokenfield:removedtoken', function (e) {
//                     let doc = PostCat.findOne({
//                         'slug': slugifyString(e.attrs.label)
//                         , name: e.attrs.label
//                     });
//                     //remove post from category
//                     if (doc) {
//                         Meteor.call("PostCatCollection.removePostFromCat", doc._id, postID);
//                     }
//                     //remove category from tag
//                     Meteor.call("postCollection.removeCategoryFromPost", postID, e.attrs.label);
//                 })
//                 .tokenfield();
//             $('#tokenfieldTag')
//                 .on('tokenfield:createtoken', function (e) {
//                     var data = e.attrs.value.split('|');
//                     e.attrs.value = data[1] || data[0];
//                     e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0]
//                     // console.log(e.attrs.value);
//                 })
//                 .on('tokenfield:createdtoken', function (e) {
//                     //if tag exists, add postId to postIds of tag
//                     //if not, create tag
//                     let doc = PostTag.findOne({
//                         'slug': slugifyString(e.attrs.value)
//                     });
//                     // console.log("postID= " + postID);
//                     if (!doc) {
//                         Meteor.call("PostTagCollection.insert", e.attrs.value, slugifyString(e.attrs.value), postID);
//                     } else {
//                         Meteor.call("PostTagCollection.addPostToTag", doc._id, postID);
//                     }
//                     //add tag to tag list of post
//                     let postWithtag = Post.findOne({
//                         id: postID, tags: {
//                             $in: [{
//                                 slug: slugifyString(e.attrs.label),
//                                 name: e.attrs.label
//                             }]
//                         }
//                     });
//                     if (!postWithtag) {
//                         Meteor.call("postCollection.addTagToPost", postID, e.attrs.label);
//
//                     }
//                     else {
//                         // console.log("tag is existed");
//                     }
//                 })
//                 .on('tokenfield:edittoken', function (e) {
//                     let doc = PostTag.findOne({
//                         'slug': slugifyString(e.attrs.label),
//                         'name': e.attrs.label
//                     });
//                     //remove post from tag
//                     Meteor.call("PostTagCollection.removePostFromTag", doc._id, postID);
//                     //remove tag from post
//                     Meteor.call("postCollection.removeTagFromPost", postID, e.attrs.label);
//                 })
//                 .on('tokenfield:removedtoken', function (e) {
//                     let doc = PostTag.findOne({
//                         'slug': slugifyString(e.attrs.label),
//                         'name': e.attrs.label
//                     });
//                     //remove post from tag
//                     if (doc) {
//                         Meteor.call("PostTagCollection.removePostFromTag", doc._id, postID);
//                     }
//                     //remove tag from post
//                     Meteor.call("postCollection.removeTagFromPost", postID, e.attrs.label);
//                 })
//                 .tokenfield();
//         });
//     });
//     Template.post_edit.events({
//         'click #btSave': function () {
//             event.preventDefault();
//             let current = FlowRouter.current();
//             let postID = current.params.postId;
//
//             let html = $('#summernote').summernote('code');
//             let title = $('#inputTitle').val();
//
//             if (title === "" || html === "") {
//                 alert("Vui lòng nhập đầy đủ trường!");
//             }
//             Meteor.call("postCollection.updateMultipleInfo", postID, title, html, featuredImage);
//
//             setTimeout(function () {
//                 $('#summernote').tokenfield('destroy');
//                 window.location.replace('/blog/' + postID);
//             });
//         },
//         'click #btDelete': function () {
//             event.preventDefault();
//             // if (!confirm("") == true) {
//             //     return;
//             // }
//             new Confirmation(
//                 {
//                     message: "Bạn có muốn xóa bài viết?",
//                     title: "Giúp Việc Đây",
//                     cancelText: "Huỷ",
//                     okText: "Đồng ý",
//                     success: true, // whether the button should be green or red
//                     focus: "none" // which button to autofocus, "cancel" (default) or "ok", or "none"
//                 }, function (ok) {
//                     // ok is true if the user clicked on "ok", false otherwise
//                     // console.log(ok);
//                     if (ok) {
//                         let current = FlowRouter.current();
//                         let postID = current.params.postId;
//
//                         Meteor.call("postCollection.removePost", postID);
//
//                         setTimeout(function () {
//                             $('#summernote').tokenfield('destroy');
//                             window.location.replace('/blog/');
//                         }, 1000);
//                     }
//                 }
//             );
//
//         },
//         'change #upload_image': function (e, template) {
//             if (e.currentTarget.files && e.currentTarget.files[0]) {
//                 // We upload only one file, in case
//                 // there was multiple files selected
//                 var file = e.currentTarget.files[0];
//                 if (file) {
//                     var uploadInstance = FeaturedImages.insert({
//                         file: file,
//                         streams: 'dynamic',
//                         chunkSize: 'dynamic'
//                     }, false);
//
//                     uploadInstance.on('start', function () {
//                         template.currentUpload.set(this);
//                     });
//
//                     uploadInstance.on('end', function (error, fileObj) {
//                         if (error) {
//                             window.alert('Error during upload: ' + error.reason);
//                         } else {
//                             // window.alert('File "' + fileObj.name + '" successfully uploaded');
//                             console.log('File "' + fileObj.name + '" successfully uploaded');
//                             console.log("fileObj._id " + fileObj._id);
//                             template.currentUpload.set(false);
//                             //set featured image
//                             featuredImage = FeaturedImages.findOne({_id: fileObj._id}).link();
//                             featuredImage = splitURL(featuredImage).pathname;
//                             $("#featured_image").attr('src', featuredImage);
//                         }
//
//                     });
//
//                     uploadInstance.start();
//                 }
//             }
//         }
//     });
//
// }