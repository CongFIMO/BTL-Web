// import {PostCat} from "../../../startup/both/postCatCollection";
// import "./post-category.html";
// import {Meteor} from "meteor/meteor";
// import {slugifyString} from "../../../helpers/slugifyString";
//
// if (Meteor.isClient) {
//     Template.showpostCat.helpers({
//         'categories': function(){
//             // var currentUserId = Meteor.userId();
//             return PostCat.find(
//                 {},
//                 {
//                     sort:
//                         {
//                             date: 1
//                         }
//                 }
//             );
//         },
//     });
//
//     Template.registerHelper('incremented', function (index) {
//         index++;
//         return index;
//     });
//
//     Template.postCatForm.helpers({
//         postCatForm: function () {
//
//         }
//     });
//
//     Template.postCatForm.events({
//         'submit form': function(){
//             event.preventDefault();
//             var postCatName = event.target.postCategory.value;
//             if (postCatName===''){
//                 alert("Enter name!");
//                 return;
//             }
//             // var currentUserId = Meteor.userId();
//             PostCat.insert({
//                 name: postCatName,
//                 slug: slugifyString(postCatName),
//                 date: new Date()
//             });
//             event.target.postCategory.value = "";
//         },
//
//     });
//
//     Template.showpostCat.events({
//         'click #delete-post-category': function () {
//             PostCat.remove({ _id: this._id });
//         },
//         'submit .form-edit':function () {
//             // Prevent default browser form submit
//             event.preventDefault();
//             // Get value from form element
//             const name = event.target.name.value;
//             console.log("name: "+ name);
//             // Insert a task into the collection
//             PostCat.update(this._id, {
//                 $set: {name: name, slug: slugifyString(name) },
//             });
//             document.getElementById("span_category_"+ this._id).style.display= "block";
//             document.getElementById("form_category_"+ this._id).style.display= "none";
//             // console.log(event.target);
//             document.getElementById("edit_post_category_"+ this._id).textContent = "Sửa";
//             document.getElementById("edit_post_category_"+ this._id).value = "edit";
//             alert("Edit Successfully!");
//
//         },
//         'click .edit-post-category': function () {
//             // Prevent default browser form submit
//             event.preventDefault();
//             var mode = document.getElementById("edit_post_category_"+ this._id).value;
//             if (mode==="save"){
//                 var name = document.getElementById("input_category_" + this._id).value;
//                 // console.log("name: "+ name);
//                 PostCat.update(this._id, {
//                     $set: {name: name, slug: slugifyString(name) },
//                 });
//                 document.getElementById("span_category_"+ this._id).style.display= "block";
//                 document.getElementById("form_category_"+ this._id).style.display= "none";
//                 console.log(event.target);
//                 document.getElementById("edit_post_category_"+ this._id).textContent = "Sửa";
//                 document.getElementById("edit_post_category_"+ this._id).value = "edit";
//                 alert("Edit Successfully!");
//             }else {
//                 document.getElementById("span_category_"+ this._id).style.display= "none";
//                 document.getElementById("form_category_"+ this._id).style.display= "block";
//                 document.getElementById("edit_post_category_"+ this._id).textContent = "Lưu";
//                 document.getElementById("edit_post_category_"+ this._id).value = "save";
//             }
//         },
//     });
//
// }