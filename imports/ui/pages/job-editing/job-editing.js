import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Job} from "../../../startup/both/jobCollection.js";
import {JobCat} from "../../../startup/both/jobCatCollection";

import "./job-editing.html";
import {messageLogError} from "../../../partials/messages-error";
import {slugifyString} from "../../../helpers/slugifyString";
import '../../../helpers/convertStringToDate'
if (Meteor.isClient) {
    const JOB_STATUS = "BIDDING";

    var messageLogSuccess = function ($message) {
        Meteor.startup(function () {
            var options = {
                effect: 'flip',
                position: 'bottom',
                timeout: '10000',
                onRouteClose: false,
                stack: false,
                offset: '0'
            };
            sAlert.success($message, options);
        });
    };
    Template.jobEditingForm.onRendered(function () {
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

        var current = FlowRouter.current();
        var jobID = current.params.id;
        // console.log("jobId= " +jobID);
        var job = Job.findOne(
            {_id: jobID}, {});
        console.log(job);
        Session.set("jobCatID", current.params.cat);
        console.log("job.cat_id= " + current.params.cat);
        Session.set("currentJobDetail", job);
        // Session.set("jobName", job.jobName);
        // Session.set("jobPref", job.jobPref);
        // Session.set("jobIntervalTime", job.time_interval);
        /*
         * Todo: need refactor DRY
         * https://forums.meteor.com/t/solved-flowrouter-detect-route-change/19938/6
         * */
        Tracker.autorun(function () {
            FlowRouter.watchPathChange();
            var route = FlowRouter.current().route.pathDef;
            if (route === '/job/:cat/:id/edit') {
                if (!Meteor.userId()) { // reactive
                    FlowRouter.go('/join');
                }
            }
        });
        $(document).ready(function () {
            $('#jobDescription').summernote({
                height: 200,                 // set editor height
                minHeight: null,             // set minimum height of editor
                maxHeight: null,
            });
        })
    });

    Template.jobEditingForm.helpers({
        jobCats: function () {
            return JobCat.find(
                {},
                {
                    sort: {
                        score: -1,
                        name: 1
                    }
                }
            );
        },

        jobDetail: function () {
            var current = FlowRouter.current();
            var jobID = current.params.id;
            var job = Job.findOne(
                {_id: jobID}, {});
            if(!job)
                return;
            // console.log("jobDescription: "+ job.description);
            $("#jobDescription").summernote("code", job.description);
            return job;
        },
        isSelectedJobCat: function (selectedJobCatId, jobCatElementId) {
            return selectedJobCatId === jobCatElementId;
        },
        checkAccepted: function (isAccepted) {
            return isAccepted === 'ACCEPTED';
        },
        checkJobIsNotAccepted: function (isAccepted) {
            return isAccepted !== 'ACCEPTED';
        },
        isCurrentPreference: function(p, current){
            let r = (p == current)? 'checked' : "";
            return r;
        }
    });


    Template.jobEditingForm.events({
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
            var jobCatNameElement = event.target.jobCatName;
            var jobCatSlug = slugifyString(jobCatNameElement.options[jobCatNameElement.selectedIndex].text);
            console.log("jobCatSlug = " + jobCatSlug);
            var jobDescription =$('#jobDescription').summernote('code');
            var jobDateStart = event.target.jobDateStart.value;
            // var jobTimeStart = event.target.jobTimeStart.value;
            var jobDateEnd = event.target.jobDateEnd.value;
            var jobPref = event.target.jobPref.value;

            //check condition between datetime start and datetime end
            var dateTimeStart = jobDateStart.toDate('mm-dd-yyyy');
            var dateTimeEnd= jobDateEnd.toDate('mm-dd-yyyy');
            // console.log("dateTimeStart= "+dateTimeStart);
            // console.log("dateTimeEnd= "+dateTimeEnd);
            if (dateTimeStart >= dateTimeEnd){
                messageLogError("Thời gian bắt đầu phải sớm hơn thời gian kết thúc!");
                return;
            }

            var current = FlowRouter.current();
            var jobID = current.params.id;
            Meteor.call("JobCollection.updateMultipleField",jobID, jobCatID, jobDescription, jobDateStart,
                jobDateEnd, jobName, JOB_STATUS, jobPref, function (error, result) {
                // console.log("result ="+ result);
                if (result === "error"){
                    messageLogError("Cập nhật không thành công!");
                    // console.log("result === error");
                }else{
                    messageLogSuccess('Bạn đã cập nhật một công việc');
                    // console.log("result === success");
                    Meteor.call("UAHCollection.insert", "job", jobID, "Bạn đã cập nhật một công việc" );
                    setTimeout(function () {
                        window.location.replace('/job/' + jobCatSlug + "/" + jobID);
                    }, 1000);
                }
            });


        },
        "click #delete_job": function (e) {
            e.stopPropagation();
            e.preventDefault();
            new Confirmation(
                {
                    message: "Bạn có thực sự muốn xóa công việc này?",
                    title: "Xóa",
                    cancelText: "Huỷ",
                    okText: "Đồng ý",
                    success: true, // whether the button should be green or red
                    focus: "none" // which button to autofocus, "cancel" (default) or "ok", or "none"
                }, function (ok) {
                    // ok is true if the user clicked on "ok", false otherwise
                    // console.log(ok);
                    if (ok) {
                        var current = FlowRouter.current();
                        var jobID = current.params.id;
                        // Job.remove({_id: jobID});
                        Meteor.call("JobCollection.removeJob", jobID);
                        // Meteor.call("UAHCollection.remove",jobID );
                        setTimeout(function () {
                            window.location.replace('/job-list/');
                        }, 1000);
                    }
                }
            );
        },

    });
    Session.setDefault("indexDis", 0);
    Template.jobEditingForm.onDestroyed(function () {
        $('#jobDescription').tokenfield('destroy');
    })
}

