// import "./post-creation.html";
// import {Meteor} from "meteor/meteor";
// import {slugifyString} from "../../../helpers/slugifyString";
// import {Post} from "../../../startup/both/postCollection";
// import {PostCat} from "../../../startup/both/postCatCollection";
// import {PostTag} from "../../../startup/both/postTagCollection";
// import FeaturedImages from "../../../startup/both/featureImageCollection.js";
// import {Template} from "meteor/templating";
// import {ReactiveVar} from "meteor/reactive-var";
// import {splitURL} from "../../../helpers/splitURL";
// const crypto = require("crypto");
// import {messageLogSuccess} from "../../../partials/messages-success";
// if (Meteor.isClient) {
//     let listTag = [];
//     let listCategory = [];
//     let featuredImage="";
//     Template.post_creation.onCreated(function () {
//         this.currentUpload = new ReactiveVar(false);
//         this.subscribe("post");
//     });
//
//     Template.post_creation.helpers({
//         currentUpload: function () {
//             return Template.instance().currentUpload.get();
//         }
//     });
//     Template.post_creation.onRendered(function () {
//         $(document).ready(function () {
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
//                     listCategory.push(
//                         {
//                             slug: slugifyString(e.attrs.value),
//                             name: e.attrs.value
//
//                         });
//
//                 })
//                 .on('tokenfield:edittoken', function (e) {
//                     let pos = listCategory.indexOf(
//                         {
//                             slug: slugifyString(e.attrs.label)
//                         }
//                     );
//                     listCategory.splice(pos, 1);
//                     console.log(listCategory);
//                 })
//                 .on('tokenfield:removedtoken', function (e) {
//                     let pos = listCategory.indexOf(
//                         {
//                             slug: slugifyString(e.attrs.label)
//                         }
//                     );
//                     listCategory.splice(pos, 1);
//                     console.log(listCategory);
//                 })
//
//                 .tokenfield();
//             $('#tokenfieldTag')
//                 .on('tokenfield:createtoken', function (e) {
//                     var data = e.attrs.value.split('|');
//                     e.attrs.value = data[1] || data[0];
//                     e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0]
//                 })
//                 .on('tokenfield:createdtoken', function (e) {
//                     listTag.push(
//                         {
//                             slug: slugifyString(e.attrs.value),
//                             name: e.attrs.value,
//                         });
//                 })
//                 .on('tokenfield:edittoken', function (e) {
//                     let pos = listTag.indexOf(
//                         {
//                             slug: slugifyString(e.attrs.label)
//                         }
//                     );
//                     listTag.splice(pos, 1);
//                 })
//                 .on('tokenfield:removedtoken', function (e) {
//                     let pos = listTag.indexOf(
//                         {
//                             slug: slugifyString(e.attrs.label)
//                         }
//                     );
//                     listTag.splice(pos, 1);
//                     console.log(listTag);
//                 })
//                 .tokenfield();
//         });
//     });
//     Template.post_creation.events({
//         'click #btPost': function () {
//             event.preventDefault();
//             let html = $('#summernote').summernote('code');
//             let title = $('#inputTitle').val();
//
//             if (listCategory.length === 0 || title === "" || html === "" || listTag.length === 0) {
//                 alert("Vui lòng nhập đầy đủ trường!");
//                 return;
//             }
//             if (featuredImage=== ""){
//                 alert("Vui lòng chọn ảnh");
//                 return;
//             }
//             const id = slugifyString(title) + "-" + crypto.randomBytes(2).toString("hex");
//
//             var callback =Meteor.call("postCollection.insert", id, title, listTag, featuredImage, listCategory, html);
//             // console.log("callback= "+callback);
//             //add post id to category
//             listCategory.forEach(function (element) {
//                 let doc = PostCat.findOne({
//                     'slug': element.slug
//                 });
//                 if (!doc) {
//                     Meteor.call("PostCatCollection.insert", element.name, element.slug, id);
//                 } else {
//                     Meteor.call("PostCatCollection.addPostToCat", doc._id, id);
//                 }
//
//             });
//             listTag.forEach(function (element) {
//                 let doc = PostTag.findOne({
//                     'slug': element.slug
//                 });
//                 if (!doc) {
//                     Meteor.call("PostTagCollection.insert", element.name, element.slug, id);
//                 } else {
//                     Meteor.call("PostTagCollection.addPostToTag", doc._id, id);
//                 }
//             });
//
//             setTimeout(function () {
//                 FlowRouter.redirect('/blog/'+id);
//                 messageLogSuccess('Bạn đã tạo thành công một bài viết.');
//             });
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
//                             console.log("fileObj._id "+ fileObj._id );
//                             template.currentUpload.set(false);
//                             //set featured image
//                             featuredImage = FeaturedImages.findOne({ _id : fileObj._id }).link();
//                             featuredImage = splitURL(featuredImage).pathname;
//                             // console.log("featureImage link = "+ featuredImage);
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
//     Template.post_creation.onDestroyed(function () {
//         $('#summernote').tokenfield('destroy');
//     })
// }
