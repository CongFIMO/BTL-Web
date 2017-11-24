import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Job} from "../../../startup/both/jobCollection.js";
import {JobCat} from "../../../startup/both/jobCatCollection";
import {JobType} from "../../../startup/both/jobTypeCollection";
import {Prov} from "../../../startup/both/province";
import "./job-editing.html";
import {messageLogError} from "../../../partials/messages-error";
import {slugifyString} from "../../../helpers/slugifyString";
import {UserActivityHistory} from "../../../startup/both/userActivityHistoryCollection";
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
        var job = Job.findOne(
            {_id: jobID}, {});
        Session.set("jobCatID", job.cat_id);
        console.log("job.cat_id= " + job.cat_id);
        Session.set("currentJobDetail", job);
        Session.set("jobIntervalTime", job.time_interval);
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
    });

    Template.jobEditingForm.helpers({
        'jobTypes': function () {
            return JobType.find(
                {cat_id: Session.get("jobCatID")},
                {
                    sort: {
                        score: -1,
                        name: 1
                    }
                }
            );
        },
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
        checkSelectedJobIntervalTimeOneTime: function () {
            if (Session.get('jobIntervalTime') == 1) {
                return 'disabled';
            } else {
                return 'required'
            }
        },
        hiddenWhenTimeIntervalOne: function () {
            if (Session.get('jobIntervalTime') == 1) {
                return 'display:none';
            }
        },
        jobDetail: function () {
            var job = Session.get("currentJobDetail");
            return job;
        },
        isSelectedJobCat: function (selectedJobCatId, jobCatElementId) {
            return selectedJobCatId === jobCatElementId;
        },
        isSelectedJobType: function (selectedJobTypeIds, jobTypeElementId) {
            if (!selectedJobTypeIds)
                return false;
            let result = false;
            selectedJobTypeIds.forEach(function (element) {
                if (element === jobTypeElementId) {
                    result = true;
                }

            });
            return result;
        },
        isSelectedIntervalTime: function (mode, selectedTimeInterval) {
            return mode === selectedTimeInterval ? "checked" : "";
        },
        checkAccepted: function (isAccepted) {
            return isAccepted === 'ACCEPTED';
        },
        checkJobIsNotAccepted: function (isAccepted) {
            return isAccepted !== 'ACCEPTED';
        },
    });


    Template.jobEditingForm.events({
        'change input[name=selectJobIntervalTime]:radio': function (event) {
            var val = event.currentTarget.value;
            // console.log(val);
            // use this value to set a reactive var
            // then use that var in the helper
            Session.set("jobIntervalTime", val);
        },
        'change #jobCatName': function (event) {
            event.preventDefault();
            var jobCatID = $(event.target).val();
            // console.log(jobCatID);
            Session.set("jobCatID", jobCatID);
        },
        'submit form': function (event) {
            event.preventDefault();
            // var jobName = event.target.jobName.value;
            var jobCatID = event.target.jobCatName.value;
            var jobCatNameElement = event.target.jobCatName;
            var jobCatSlug = slugifyString(jobCatNameElement.options[jobCatNameElement.selectedIndex].text);
            console.log("jobCatSlug = " + jobCatSlug);
            var jobDescription = event.target.jobDescription.value;
            // var selectJobTime = event.target.selectJobTime.value;
            var selectTimeInterval = event.target.selectJobIntervalTime.value;
            var jobDateStart = event.target.jobDateStart.value;
            var jobTimeStart = event.target.jobTimeStart.value;
            var jobDateEnd = event.target.jobDateEnd.value;
            var jobTimeEnd = event.target.jobTimeEnd.value;
            var provinceAddress = event.target.provinceAddress.value;
            var disAddress = event.target.disAddress.value;
            var homeAddress = event.target.homeAddress.value;
            // console.log(currentUserID);

            var jobChecked = [];
            $.each($('[name="jobName"]:checked'), function (index, item) {
                jobChecked.push(item.value);
            });
            if (jobChecked.length === 0) {
                alert("Hãy chọn loại công việc!");
                return;
            }
            //console.log(Prov[provinceAddress].name);
            var newProvinceAddress = Prov[provinceAddress].name;
            // console.log(Prov[provinceAddress].dis[disAddress]);
            var newdisAddress = Prov[provinceAddress].dis[disAddress];

            var current = FlowRouter.current();
            var jobID = current.params.id;
            Meteor.call("JobCollection.updateMultipleField",jobID, jobChecked, jobCatID, jobDescription, selectTimeInterval, jobDateStart, jobTimeStart, jobDateEnd, jobTimeEnd, newProvinceAddress, newdisAddress, homeAddress, function (error, result) {
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
                    title: "Giúp Việc Đây",
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

    Template.addressJobEditing.helpers({
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
        jobDetail: function () {
            var job = Session.get("currentJobDetail");
            return job;
        },
        isSelectedDistrict: function (selected, element) {
            return selected === element;
        },
        isSelectedProvince: function (provinceName, element, index) {
            if (provinceName === element) {
                Session.set('indexDis', index);
                return true;
            }
            return false;
        },
    });

    Template.addressJobEditing.events({
        "change #provinceAddress": function (evt) {
            var provinceId = $(evt.target).val();
            // console.log(provinceId);
            Session.set("indexDis", provinceId);
            // console.log((Session.get("indexDis")));
        }
    });

}

