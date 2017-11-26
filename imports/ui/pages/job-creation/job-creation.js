import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Job} from "../../../startup/both/jobCollection.js";
import {JobCat} from "../../../startup/both/jobCatCollection";
import {JobType} from "../../../startup/both/jobTypeCollection";
import {Prov} from "../../../startup/both/province";
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
        // Session.setDefault("jobIntervalTime", 1);
    });

    Template.jobForm.helpers({
        // jobTypes: function () {
        //     // var currentUserId = Meteor.userId();
        //     return JobType.find({cat_id: Session.get('jobCatID')}, {sort: {score: -1, name: 1}});
        // },
        jobCats: function () {
            return JobCat.find({}, {sort: {score: -1, name: 1}});
        },
        // checkSelectedJobIntervalTimeOneTime: function () {
        //     if (Session.get('jobIntervalTime') == 1) {
        //         return 'disabled';
        //     } else {
        //         return 'required'
        //     }
        // },
        // hiddenWhenTimeIntervalOne: function () {
        //     if (Session.get('jobIntervalTime') == 1) {
        //         return 'display:none';
        //     }
        // },
        // changeTextDisplayForTimeInterverlOne: function () {
        //     if (Session.get('jobIntervalTime') == 1) {
        //         return true;
        //     } else {
        //         return false
        //     }
        // }
    });


    Template.jobForm.events({
        // 'change input[name=selectJobIntervalTime]:radio': function (event) {
        //     var val = event.currentTarget.value;
        //     // console.log(val);
        //     // use this value to set a reactive var
        //     // then use that var in the helper
        //     Session.set("jobIntervalTime", val);
        // },
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
            // var selectJobTime = event.target.selectJobTime.value;
            //var selectTimeInterval = event.target.selectJobIntervalTime.value;
            var jobDateStart = event.target.jobDateStart.value;
            //var jobTimeStart = event.target.jobTimeStart.value;
            var jobDateEnd = event.target.jobDateEnd.value;
            var jobPref = event.target.jobPref.value;
            //var jobTimeEnd = event.target.jobTimeEnd.value;
            //var provinceAddress = event.target.provinceAddress.value;
            //var disAddress = event.target.disAddress.value;
            //var homeAddress = event.target.homeAddress.value;
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


            //var newProvinceAddress = Prov[provinceAddress].name;

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

    Template.addressJob.helpers({
        'provinceAddress': function () {
            // console.log(Prov);
            return Prov;
        },
        'disAddress': function () {
            // console.log(Prov[index]);
            var index = Session.get("indexDis");
            // console.log(Prov[index]);
            return Prov[index].dis;
        },
        'provinceSelected': function (provinceName, index) {
            var selected = '';
            if (Meteor.user() && provinceName === Meteor.user().profile.province) {
                selected = 'selected';
                Session.set('indexDis', index);
            }
            return selected;
        },
        'disSelected': function (districtName, index) {
            var selected = '';
            if (Meteor.user() && districtName === Meteor.user().profile.district) {
                selected = 'selected';

                // Session.set('indexDis', index);
            }
            return selected;
        },
    });

    Template.addressJob.events({
        "change #provinceAddress": function (evt) {
            var provinceId = $(evt.target).val();
            // console.log(provinceId);
            Session.set("indexDis", provinceId);
            // console.log((Session.get("indexDis")));
        }
    });

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

