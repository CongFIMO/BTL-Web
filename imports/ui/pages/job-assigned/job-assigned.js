import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from 'meteor/session';

import {Job} from "../../../startup/both/jobCollection.js";
import {JobCat} from "../../../startup/both/jobCatCollection";
import "../../layouts/titlebar/job-list/titlebar.js";

import Images from "../../../startup/both/images.collection.js";

import "./job-assigned.html";
import "../common-template/pagination.html";
import {messageLogSuccess} from "../../../partials/messages-success";
import {messageLogError} from "../../../partials/messages-error";
import {splitURL} from "../../../helpers/splitURL";
import {postSummary} from "../../../helpers/postsummary";
import {paginationDataGeneration} from "../../../helpers/paginationDataGeneration";
import {UserActivityHistory} from "../../../startup/both/userActivityHistoryCollection";

const RECORD_PER_PAGE = 5;
const NUMBER_OF_VISIBLE_PAGE = 5;
const PATH_JOB_PAGE = '/job-assigned/page/';

if (Meteor.isClient) {
    var skipCount = 1;
    Template.jobAssigned.onCreated(function () {
        // Check subscribe Collection
        Session.set('avatarSubscribeReady', false);
        this.subscribe("avatar", {
            onReady: function () {
                Session.set('avatarSubscribeReady', true);
            }
        });
        // Page pagination
        var template = this;
        template.autorun(function () {
            skipCount = (currentPage() - 1) * RECORD_PER_PAGE;
            template.subscribe('jobPagination', skipCount);
            //
            if (currentPage() === 1) {
                $('#prevPage').css("pointer-events", "none");
                // console.log("currentpage=1");
            }
            if (currentPage() === getNumberOfPage()) {
                $('#nextPage').css("pointer-events", "none");
                // console.log("currentpage=n");
            }
        });
    });
    Template.jobAssigned.onRendered(function () {
        var instance = this;
        instance.autorun(function () {
            $('body').each(function () {
                // $(this).contents().wrapAll('<div id="wrapper">');
            });
        });
        $(document).ready(function () {
            if (currentPage() === 1) {
                $('#prevPage').css("pointer-events", "none");
            }
            if (currentPage() === getNumberOfPage()) {
                $('#nextPage').css("pointer-events", "none");
            }
        })
    });

    Template.jobAssigned.events({
        "click .goPage": function () {
            BlazeLayout.reset();
        },
        "click .delete_job": function (e) {
            e.stopPropagation();
            e.preventDefault();
            var id = this._id;
            new Confirmation(
                {
                    message: "Bạn có thực sự muốn xóa công việc này?",
                    title: "Xóa Công Việc",
                    cancelText: "Huỷ",
                    okText: "Đồng ý",
                    success: true, // whether the button should be green or red
                    focus: "none" // which button to autofocus, "cancel" (default) or "ok", or "none"
                }, function (ok) {
                    if (ok) {
                        var result = Meteor.call("JobCollection.removeJob", id);
                        if (result === "error") {
                            messageLogError('Thao tác bị lỗi!');
                        } else {
                            messageLogSuccess('Bạn đã xóa một việc.');
                        }
                    }
                }
            );
        }
    });

    Template.jobAssigned.helpers({
        'jobs': function () {
            // var currentUserId = Meteor.userId();
            var jobs = Job.find()
                .fetch();
            jobs.forEach(function (element) {
                element.description = postSummary(element.description);
            });
            // console.log(jobs);
            return jobs;
        },
        'jobName': function (catID) {
            var jobcat = JobCat.findOne({_id: catID}, {fields: {name: 1},});
            var name = jobcat && jobcat.name;
            // console.log(name);
            return name;
        },
        'catSlug': function (catID) {
            var jobcat = JobCat.findOne({_id: catID}, {fields: {name: 1, slug: 1},});
            // console.log(jobcat);
            var cat_slug = jobcat && jobcat.slug;
            // console.log(cat_slug);
            return cat_slug;
        },
        avatar: function (userID) {
            if (Session.get('avatarSubscribeReady')) {
                if (userID !== undefined) {
                    var avatar = Images.findOne({userId: userID});
                    if (avatar !== undefined) {
                        avatar = avatar.link();
                    } else {
                        return '#';
                    }
                    avatar = splitURL(avatar).pathname;
                    return avatar;
                } else {
                    return '#';
                }
            }
        },

        'checkUserCreatedJob': function () {
            var currentUserID = Meteor.userId();
            var jobID = Session.get("jobID");
            var job = Job.findOne({_id: jobID}, {fields: {user_id: 1,}});
            var userIDCreatedJob = job && job.user_id;
            // console.log(userIDCreatedJob);
            if (userIDCreatedJob === currentUserID) {
                return true;
            } else {
                return false;
            }
        },

        checkAccepted: function (isAccepted) {
            return isAccepted === 'ACCEPTED';
        },
        isAdmin: function () {
            return Roles.userIsInRole(Meteor.userId(), ["admin"]);
        },
        checkJobIsNotAccepted: function (isAccepted) {
            return isAccepted !== 'ACCEPTED';
        }
    });


    Template.pagination.helpers({
        prevPage: function () {
            var previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
            return PATH_JOB_PAGE + previousPage;
        },
        nextPage: function () {
            var nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
            return PATH_JOB_PAGE + nextPage;
        },
        pageNumbers: function () {
            // let jobCount = Counts.get('jobCount');
            return paginationDataGeneration(paginationMoreMode(), currentPage(), getNumberOfPage());
        },
        link: function () {
            return PATH_JOB_PAGE;
        },
        paginationMoreMode: function () {
            return paginationMoreMode();
        }
    })

    Template.titlebarJobAssigned.helpers({
        jobNumbers(){
            return Counts.get("jobCount");
        },
        newJobNumbers () {
            return Counts.get('newJobCount');
        },inprogressJobNumbers () {
            return Counts.get('inprogressJobCount');
        },resolvedJobNumbers () {
            return Counts.get('resolvedJobCount');
        },feedbackJobNumbers () {
            return Counts.get('feedbackJobCount');
        },closedJobNumbers () {
            return Counts.get('closedJobCount');
        },
        numberUserFindJob () {
            // console.log( Meteor.users.find().count());
            // Meteor.call('numberUserFindJob');
            // console.log(Session.get('numberUserFindJob'));
        }
    });

    var hasMorePages = function () {
        var currentPage = parseInt(FlowRouter.current().params.page) || 1;
        var jobCount = Counts.get('jobCount');
        console.log("jobCount= " + jobCount);
        return currentPage * RECORD_PER_PAGE < jobCount;
    };
    var currentPage = function () {
        return parseInt(FlowRouter.current().params.page) || 1;
    };
    var paginationMoreMode = function () {
        if (getNumberOfPage() > NUMBER_OF_VISIBLE_PAGE)
            return true;
        return false;
    };
    var getNumberOfPage = function () {
        let jobCount = Counts.get('jobCount');
        let numberOfPage = (jobCount / RECORD_PER_PAGE) > Math.floor(jobCount / RECORD_PER_PAGE)
            ? (Math.floor(jobCount / RECORD_PER_PAGE) + 1) : Math.floor(jobCount / RECORD_PER_PAGE);
        return numberOfPage;
    }
}
