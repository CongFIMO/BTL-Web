import {JobCat} from "../../../startup/both/jobCatCollection";
import "./job-category.html";
import "../job-type/job-type.html";
import {Meteor} from "meteor/meteor";
import {slugifyString} from "../../../helpers/slugifyString";

// import {JobType} from "../../../startup/both/jobTypeCollection.js";

if (Meteor.isClient) {
    Template.showJobCat.helpers({
        'categories': function () {
            var currentUserId = Meteor.userId();
            // var jobT = JobType.find({}, {sort: {score: -1, name: 1}}).fetch();
            var jobC = JobCat.find({}, {sort: {score: -1, name: 1}}).fetch();

            jobC.forEach((itemT, indexT) => {
                itemT.listType = [];
            });

            //add job to each jobType
            // jobT.forEach(function (jobTypeElement) {
            //     jobC.forEach(function (jobCatElement) {
            //         if (jobTypeElement.cat_id === jobCatElement._id) {
            //             jobCatElement.listType.push(
            //                 {
            //                     catId: jobTypeElement._id,
            //                     name: jobTypeElement.name
            //                 });
            //             // console.log("jobCatElement._id " + jobCatElement.type_id + " contains : " + jobTypeElement._id);
            //         }
            //     })
            // });
            // jobC.forEach(function (jobCatElement) {
            //     jobCatElement.numberOfType = jobCatElement.listType.length;
            // });
            return jobC;
        },
        "isErasable": function (numberOfType) {
            return (numberOfType > 0) ? false : true;
        },
        "isCollapsible": function (numberOfType) {
            return (numberOfType > 0) ? true : false;
        }
    });

    Template.registerHelper('incremented', function (index) {
        index++;
        return index;
    });

    Template.jobCatForm.helpers({
        jobCatForm: function () {
        }
    });

    Template.jobCatForm.events({
        'submit form': function () {
            event.preventDefault();
            var jobCatName = event.target.jobCategory.value;
            // var currentUserId = Meteor.userId();
            // JobCat.insert({
            //     name: jobCatName,
            //     date: new Date(),
            //     slug: slugifyString(jobCatName)
            // });
            Meteor.call("JobCatCollection.insert",jobCatName, slugifyString(jobCatName));
            event.target.jobCategory.value = "";
        }
    });

    Template.showJobCat.events({
        'click #delete-job-category': function () {
            // if (this.listType.length === 0)
                // JobCat.remove({_id: this._id});
                Meteor.call("JobCatCollection.remove", this._id);
            // else
            //     alert("Bạn chỉ có thể xóa nhóm công việc chưa được dùng!");
        },
        'click .showMore': function () {
            $('#header_' + this._id).nextUntil('tr.header').slideToggle(50);
            // console.log("click showMore header_" + this._id);
        }
    });
}