import {Meteor} from "meteor/meteor";
import {JobCat} from "../../../startup/both/jobCatCollection.js";
import {Job} from "../../../startup/both/jobCollection.js";
import {JobType} from "../../../startup/both/jobTypeCollection.js";
import "./job-type.html";
import './job-type.html';
import {messageLogError} from "../../../partials/messages-error";

if (Meteor.isClient) {
    Template.jobTypeForm.helpers({
        'categories': function () {
            // var currentUserId = Meteor.userId();
            return JobCat.find({}, {sort: {score: -1, name: 1}});
        },
    });

    Template.jobTypeForm.events({
        'submit form': function (event) {
            event.preventDefault();
            var jobTypeName = event.target.jobTypeName.value;
            var jobCatId = event.target.selectJobCat.value;
            // console.log(jobCatId);
            // var currentUserId = Meteor.userId();
            // console.log(JobType);
            // JobType.insert({
            //     name: jobTypeName,
            //     date: new Date(),
            //     cat_id: jobCatId
            // });
            Meteor.call("JobTypeCollection.insert", jobTypeName, jobCatId);
            event.target.jobTypeName.value = "";
        },
    });

    Template.showJobType.helpers({
        'jobType': function () {
            // var currentUserId = Meteor.userId();
            var jobT = JobType.find({}).fetch();
            var jobC = JobCat.find({}).fetch();
            //save listType to query job
            var listType = [];
            //group jobCat by jobType
            jobT.forEach((itemT, indexT) => {
                //add typeId to listType
                listType.push(itemT._id);
                //init listJob of jobType array
                itemT.listJob = [];
                //group
                jobC.forEach((itemC, indexC) => {
                    if (itemT.cat_id === itemC._id)
                        itemT.cat_name = itemC.name;
                })
            });
            // console.log("listType= " + listType);
            //query job by type
            var jobData = Job.find({}, {job_group: {$elemMatch: listType}}).fetch();
            //add job to each jobType
            jobData.forEach(function (jobElement) {
                if (!jobElement.job_group)
                    return;
                jobT.forEach(function (jobTypeElement) {
                    jobElement.job_group.forEach(function (typeId) {
                        if (typeId === jobTypeElement._id) {
                            jobTypeElement.listJob.push(
                                {
                                    jobId: jobElement._id
                                }
                            );
                            // console.log("jobTypeElement._id " + jobTypeElement._id + " contains: " + typeId);
                        }
                    })

                })
            });
            jobT.forEach(function (jobTypeElement) {
                jobTypeElement.numberOfJob= jobTypeElement.listJob.length;
            });
            return jobT;

        },
        "isErasable": function (numberOfJob) {
            return (numberOfJob > 0) ? false : true;
        },
        "isCollapsible": function (numberOfJob) {
            return (numberOfJob > 0) ? true : false;
        }
    });

    Template.showJobType.events({
        'click .delete-job-type': function () {
            if (this.listJob.length === 0)
                // JobType.remove({_id: this._id});
                Meteor.call("JobTypeCollection.remove", this._id);
            else
                alert("Bạn chỉ có thể xóa loại công việc chưa được dùng!");
            // messageLogError("Bạn chỉ có thể xóa loại công việc chưa được dùng!");
        },
        'click .showMore': function () {
            $('#header_' + this._id).nextUntil('tr.header').slideToggle(50);
            // console.log("click showMore header_"+ this._id);
        }
    });
}