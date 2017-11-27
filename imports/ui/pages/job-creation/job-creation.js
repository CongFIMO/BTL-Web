import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Job} from "../../../startup/both/jobCollection.js";
import {JobCat} from "../../../startup/both/jobCatCollection";
import {JobType} from "../../../startup/both/jobTypeCollection";
// import {Prov} from "../../../startup/both/province";
import "./job-creation.html";
import {messageLogSuccess} from "../../../partials/messages-success";
import {messageLogError} from "../../../partials/messages-error";

if (Meteor.isClient) {
    const jobStatus = "BIDDING";
    Template.jobForm.onRendered(function () {
        Meteor.setTimeout(function () {
            this.$('#date-picker-start').datetimepicker({
                format: 'L',
                icons: {
                    next: "fa fa-chevron-right",
                    previous: "fa fa-chevron-left"
                }
            });
            this.$('#time-picker-start').datetimepicker({
                format: 'LT',
                icons: {
                    up: "fa fa-chevron-up",
                    down: "fa fa-chevron-down",
                }
            });
            this.$('#date-picker-end').datetimepicker({
                format: 'L',
                icons: {
                    next: "fa fa-chevron-right",
                    previous: "fa fa-chevron-left"
                }
            });
            this.$('#time-picker-end').datetimepicker({
                format: 'LT',
                icons: {
                    up: "fa fa-chevron-up",
                    down: "fa fa-chevron-down",
                }
            });
        }, 10);
        Session.setDefault("jobCatID", JobCat.findOne()._id);
    });

    Template.jobForm.helpers({
        // jobTypes: function () {
        //     // var currentUserId = Meteor.userId();
        //     return JobType.find({cat_id: Session.get('jobCatID')}, {sort: {score: -1, name: 1}});
        // },
        jobCats: function () {
            return JobCat.find({}, {sort: {score: -1, name: 1}});
        },
    });


    Template.jobForm.events({

        'change #jobCatName': function (event) {
            event.preventDefault();
            var jobCatID = $(event.target).val();
            // console.log(jobCatID);
            Session.set("jobCatID", jobCatID);
        },
        'submit form': function (event) {
            event.preventDefault();
            var jobName = event.target.jobName.value;
            var jobCatID = event.target.jobCatName.value;
            var jobDescription = event.target.jobDescription.value;
            var jobDateStart = event.target.jobDateStart.value;
            var jobDateEnd = event.target.jobDateEnd.value;
            var jobPref = event.target.jobPref.value;
            var currentUserID = Meteor.userId();
            var user = Meteor.user();
            // console.log(currentUserID);

            // var jobChecked = [];
            // $.each($('[name="jobName"]:checked'), function (index, item) {
            //     jobChecked.push(item.value);
            // });
            // if (jobChecked.length === 0) {
            //     alert("Hãy chọn loại công việc!");
            //     return;
            // }


            //var newdisAddress = Prov[provinceAddress].dis[disAddress];
            Meteor.call("JobCollection.insert", jobCatID, jobStatus, currentUserID,
                user, jobDescription, jobDateStart,jobName,
                jobDateEnd,jobPref , function (error, result) {
                    if (result === "error") {
                        messageLogError("Thao tác bị lỗi");
                    }
                    else {
                        var cat = JobCat.findOne({_id: jobCatID}, {fields: {slug: 1}});
                        setTimeout(function () {
                            FlowRouter.redirect('/job/' + cat.slug + '/' + result);
                            console.log('/job/' + cat.slug + '/' + result);
                            messageLogSuccess('Bạn đã thêm mới thành công một việc!!!');
                        }, 1000);
                    }
                });
        },
    });
    Session.setDefault("indexDis", 0);

    Template.jobDisplay.helpers({
        jobDisplay: function (currentUserID) {
            // console.log(currentUserID);
            var jobs = Job.find({user_id: currentUserID}, {sort: {score: -1, name: 1}}).fetch();
            var jobT = JobType.find({}, {sort: {score: -1, name: 1}}).fetch();
            // var jobC = JobCat.find({},{sort:{score: -1,name: 1}}).fetch();
            jobs.forEach((item, index) => {
                jobT.forEach((itemT, indexT) => {
                    if (itemT._id === item.type_id)
                        jobs[index].name = itemT.name;
                })
            });
            return jobs;
        }
    });
}

