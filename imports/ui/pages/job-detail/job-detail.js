import "./job-detail.html";
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {FlowRouter} from "meteor/kadira:flow-router";
import {BlazeLayout} from "meteor/kadira:blaze-layout";
import {Session} from "meteor/session";
import {Job} from "../../../startup/both/jobCollection.js";
import {JobCat} from "../../../startup/both/jobCatCollection";
import {messageLogSuccess} from "../../../partials/messages-success";
import Images from "../../../startup/both/images.collection.js";
import {splitURL} from "../../../helpers/splitURL";
import {formatDate} from "../../../helpers/formatdate";
import {Cmt} from "../../../../imports/startup/both/comment";
import {paginationDataGeneration} from "../../../helpers/paginationDataGeneration";
const crypto = require("crypto");

if (Meteor.isClient) {
    const RECORD_PER_PAGE = 10;
    const NUMBER_OF_VISIBLE_PAGE = 5;
    var PATH_JOB_PAGE;
    var skipCount = 1;

    Template.jobDetail.onCreated(function () {
        var id = FlowRouter.current().params.id;
        var cat = FlowRouter.current().params.cat;
        PATH_JOB_PAGE = '/job/' + cat + "/" + id + "/";
        console.log("PATH_JOB_PAGE= " + PATH_JOB_PAGE);
        // this.subscribe("users");
        var current = FlowRouter.current();
        var currentID = current.params.id;
        this.subscribe("jobs", function () {
            var check = Job.findOne({_id: currentID});
            if (!check) {
                FlowRouter.go('/job-list');
            }
        });
        Session.set('avatarSubscribeReady', false);
        this.subscribe("avatar", {
            onReady: function () {
                Session.set('avatarSubscribeReady', true);
            }
        });
        Session.setDefault("jobID", '');
        Session.setDefault("jobCatID", '');
        Session.setDefault("jobStatus", '');
        Session.setDefault("userAcceptedID", '');
        Session.setDefault("acceptCancel", '');
        Session.setDefault("multiDate", false);
        // Session.setDefault("check", check);
        this.subscribe("jobcat", function () {
            var jobCat = JobCat.findOne({slug: cat});
            console.log("cat= " + cat);
            console.log("jobCat.name= " + jobCat.name);

            template.subscribe('listUser', skipCount, jobCat.name);
        });
        var template = this;
        template.autorun(function () {
            skipCount = (currentPage() - 1) * RECORD_PER_PAGE;

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
    Template.jobDetail.onRendered(function () {
        $(document).ready(function () {
            if (currentPage() === 1) {
                $('#prevPage').css("pointer-events", "none");
            }
            if (currentPage() === getNumberOfPage()) {
                $('#nextPage').css("pointer-events", "none");
            }
        })
    });
    Template.jobDetail.helpers({
        'checkUserSlave': function () {
            var user = Meteor.user();
            var user_type = user && user.profile.user_type;
            if (user_type == 2) {
                return true;
            } else {
                return false;
            }
        },
        'jobInfoID': function () {
            // var jobID = FlowRouter.current().route;
            var current = FlowRouter.current();
            var currentID = current.params.id;
            if (currentID) {
                Session.set('jobID', currentID);
            }
        },
        'jobInfo': function () {
            var current = FlowRouter.current();
            var jobID = current.params.id;
            // var jobID = Session.get("jobID");
            // console.log(jobID);
            var job = Job.findOne({_id: jobID},
                {
                    fields: {
                        _id: 1,
                        date_create: 1,
                        description: 1,
                        user_id: 1,
                        status: 1,
                        date_start: 1,
                        date_end: 1,
                        user_id_accepted: 1,
                        name: 1,
                        cat_id: 1,
                        preference: 1,
                        // user_registered: 1,
                        home: 1,
                        'user.emails': 1,
                        'user.profile.full_name': 1,
                        'user.profile.avatar': 1,
                        'user.profile.phone': 1,
                        'user.profile.province': 1,
                        'user.profile.district': 1,
                        'user.profile.home_address': 1,
                        'user.profile.info': 1,
                    }
                }
            );
            var date_create = job && job.date_create;
            var user_id_accepted = job && job.user_id_accepted;
            var description = job && job.description;
            var name = job && job.name;
            // var time = job && job.time;
            var user_id_created_job = job && job.user_id;
            var date_start = job && job.date_start;
            var date_end = job && job.date_end;
            var preference = job && job.preference;
            var email = job && job.user.emails;
            var full_name = job && job.user.profile.full_name;
            var avatar = job && job.user.profile.avatar;
            var phone = job && job.user.profile.phone;
            var info = job && job.user.profile.info;


            var jobCatID = job && job.cat_id;
            var jobStatus = job && job.status;
            var status = job && job.status;
            //stackoverflow.com/questions/29745873/hour-difference-between-two-timeshhmmss-ain-momentjs
            // description = postSummary(description);
            // user_registered = job && job.user_registered;

            Session.set('jobCatID', jobCatID);
            Session.set('jobStatus', jobStatus);

            var dateTme = new Date(date_create);
            // console.log(d);
            date_create = formatDate(dateTme);

            $("#description").html(description);
            return {
                date_create,
                // description,
                user_id_created_job,
                date_start,
                name,
                date_end,
                user_id_accepted,
                avatar,
                email,
                full_name,
                phone,
                info,
                jobStatus,
                preference,
                status
            }
        },
        'jobName': function () {
            // var currentUserId = Meteor.userId();
            var jobCatID = Session.get("jobCatID");
            var jobcat = JobCat.findOne({_id: jobCatID}, {fields: {name: 1}});
            return jobcat;
        },
        'listUser': function () {
            var jobID = Session.get("jobID");
            // console.log(jobID);
            var job = Job.findOne({_id: jobID},
                {fields: {status: 1, user_registered: 1, user_id_accepted: 1,}});
            var userRegistered = job && job.user_registered;
            var user_id_accepted = job && job.status === 'ACCEPTED' && job.user_id_accepted;
            // var user_id_accepted = job && job.user_id_accepted;
            return {
                userRegistered,
                user_id_accepted
            }

        },
        'statusJob': function (userIdAccepted) {
            // var jobstatus = Session.get('jobStatus');
            var jobID = Session.get("jobID");
            var job = Job.findOne({_id: jobID}, {fields: {status: 1, user_id_accepted: 1,}});
            var jobstatus = job && job.status;
            var user_id_accepted = job && job.user_id_accepted;

            if (jobstatus === 'ACCEPTED' && user_id_accepted === userIdAccepted) {
                return 'accepted bg-success highlighted';
            } else {
                return '';
            }
        },
        'checkStatusNotAccepted': function () {
            var jobID = Session.get("jobID");
            var job = Job.findOne({_id: jobID}, {fields: {status: 1,}});
            var jobstatus = job && job.status;
            if (jobstatus !== 'ACCEPTED') {
                return true;
            } else {
                return false;
            }
        },
        'checkUserInsideJobRegister': function () {
            var userID = Meteor.userId();
            var jobID = Session.get("jobID");
            var job = Job.findOne({_id: jobID}, {fields: {status: 1, user_registered: 1,}});
            var user_registered = job && job.user_registered;

            var found = false;
            if (user_registered) {
                user_registered.forEach(function (user) {
                    if (userID == user._id) {
                        // console.log('true');
                        found = true;
                    }
                    // console.log('false');
                });
            }
            return found;
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
        'getAvatarUrl': function (userID) {
            // console.log(userID);
            if (Session.get('avatarSubscribeReady')) {
                if (userID !== undefined) {
                    var avatar = Images.findOne({userId: userID});
                    if (avatar !== undefined) {
                        avatar = avatar.link();
                    } else {
                        return '#';
                    }
                    avatar = splitURL(avatar).pathname;
                    // console.log("Link: " + avatar);
                    return avatar;
                } else {
                    return '#';
                }
            }
        },
        'userMilestone': function (userID) {
            // console.log(userID);
            var user = Meteor.users.findOne({_id: userID},
                {fields: {'milestone.job_accepted': 1, 'milestone.time_workerd': 1,}});
            var job_accepted = user && user.milestone.job_accepted;
            var time_workerd = user && user.milestone.time_workerd;
            return {
                job_accepted,
                time_workerd
            };
        },
        'formatDateTime': function (date) {
            var datetime = moment(date).format('DD-MM-YYYY');
            return datetime;
        },
        'isJobAccepted': function (jobStatus) {
            return jobStatus === 'ACCEPTED';
        },
        'isUserRented': function (userId, acceptedUserId, jobStatus) {
            // console.log("user id = " + userId + "/ accepted = " + acceptedUserId + "/ jobStatus= " + jobStatus);
            return (userId === acceptedUserId && jobStatus === 'ACCEPTED');
        },
        getJobCatName: function () {
            var jobCat = JobCat.findOne({_id: Session.get("jobCatID")});
            console.log(jobCat.name);
            return jobCat.name;
        },
        listUserToChoice: function () {
            //get list user
            var listUser = Meteor.users.find({}, {
                fields: {_id: 1, username: 1, emails: 1}, sort: {
                    createdAt: -1
                }
            }).fetch();
            var currentEmail = Meteor.user().emails[0].address;
            var currentUserIndex = -1;
            listUser.forEach(function (element, i) {
                if (element.emails[0].address=== currentEmail){
                    currentUserIndex= i;
                }
            })
            if (currentUserIndex>0){
                listUser.splice(currentUserIndex, 1);
            }
            console.log("listUser = " + listUser[0]);
            return listUser;
        },
        'isCurrentStatus': function (status, current) {
            console.log("isCurrentStatus: " + status + "--" + current);
            var jobStat = (status == current) ? 'selected' : "";
            return jobStat;
        }
    });

    Template.jobDetail.events({
        'change #jobStatus': function (event) {
            event.preventDefault();
            var jobID = Session.get("jobID");
            var newStat = event.target.jobStatus.value;
            // Meteor.call("JobCollection.updateStatus",jobID,newStat)
            Session.set('jobStatus', newStat);
        }
    });

    Template.cancelRegister.events({
        'click .cancel': function (event) {
            event.preventDefault();
            new Confirmation(
                {
                    message: "Bạn đang thực hiện hủy việc một việc đã đăng ký, tiếp tục chứ",
                    title: "Hủy việc đẵ đăng ký",
                    cancelText: "Huỷ",
                    okText: "Đồng ý",
                    success: true, // whether the button should be green or red
                    focus: "none" // which button to autofocus, "cancel" (default) or "ok", or "none"
                }, function (ok) {
                    // ok is true if the user clicked on "ok", false otherwise
                    // console.log(ok);
                    if (ok) {
                        // var acceptCancel = Session.get("acceptCancel");
                        var userID = Meteor.userId();
                        var jobID = Session.get("jobID");
                        var job = Job.findOne({_id: jobID},
                            {fields: {status: 1, user_registered: 1,}}
                        );
                        var user_registered = job && job.user_registered;

                        if (user_registered) {
                            user_registered.forEach(function (user, index) {
                                if (userID === user._id) {
                                    user_registered.splice(index, 1); // Remove user from list Job Register when submited Cancel
                                }
                            });
                            // Job.update({_id: jobID}, {$set: {user_registered: user_registered}});
                            Meteor.call("JobCollection.updateUserRegisteredList", jobID, user_registered);
                            Meteor.call("UAHCollection.insert", "job", doc._id, "Bạn đã hủy đăng kí công việc");
                        }
                    } else {
                        Session.set("acceptCancel", 'cancel');
                        return false;
                    }
                }
            );
        },
    });

    Template.jobRegister.events({
        'submit form': function (event) {
            event.preventDefault();
            var currentUser = Meteor.user();

            var jobID = Session.get("jobID");

            Meteor.call("JobCollection.updateUserRegistered", jobID, currentUser);
            Meteor.call("UAHCollection.insert", "job", jobID, "Bạn đã đăng kí việc thành công");
            messageLogSuccess('Đăng ký việc thành công');
            event.target.reset();
        },
    });

    Template.userRegisteredList.helpers({});

    Template.userRegisteredList.events({});
    Template.jobDetail.events({
        'click .accept-button': function () {
            var user_id_accepted = $(this)[0]._id;
            var jobID = Session.get("jobID");
            // Job.update({_id: jobID}, {$set: {user_id_accepted: user_id_accepted, status: 'ACCEPTED'}});
            Meteor.call("JobCollection.updateAcceptedUser", jobID, user_id_accepted);
            Meteor.call("UAHCollection.insert", "job", jobID, "Bạn đã chấp nhận người giúp việc");

            Session.set('jobStatus', 'ACCEPTED');
            Session.set('userAcceptedID', user_id_accepted);
        },
        'change #jobStatus': function (event) {
            event.preventDefault();
            // var jobID = Session.get("jobID");
            var current = FlowRouter.current();
            var jobID = current.params.id;
            var newStat = $(event.target).val();
            Meteor.call("JobCollection.updateStatus", jobID, newStat)
            Session.set('jobStatus', newStat);
            console.log("status changed");
        }
    });

    Template.showcmt.helpers({
        'comments': function () {
            let data = Cmt.find(
                {jobID: FlowRouter.current().params.id},
                {
                    sort: {
                        date: -1
                    }
                }
            );
            // console.log("cmt data " + data);
            return data;
        }
    });

    Template.comment.events({
        'submit form': function () {
            event.preventDefault();
            var Comment = event.target.comment.value;
            if (Comment === '') {
                alert("Enter Comment!");
                return;
            }
            Meteor.call("CommentCollection.insert", Comment, FlowRouter.current().params.id);
            event.target.comment.value = "";
        },

    });

    let id = "";
    Template.showcmt.events({
        'submit .form-cmt': function () {
            event.preventDefault();
            const name = event.target.name.value;
            Meteor.call("CommentCollection.updateName", this._id, name);
        },

        'submit .form-rep': function () {
            event.preventDefault();
            const name = event.target.name.value;
            console.log("name: " + name);

            Meteor.call("CommentCollection.updateName", this._id, name);
        },

        'click .btn-rep': function () {
            event.preventDefault();

            if (Meteor.user()) {
                id = crypto.randomBytes(16).toString("hex");
                var textRep = document.createElement("textarea");
                textRep.id = 'Txt-rep' + id;
                textRep.className = "reps";

                document.getElementById("save_" + this._id).style.display = "block";
                document.getElementById("form_cmt_" + this._id).appendChild(textRep);

                document.getElementById("rep_" + this._id).disabled = true;
            }
            else {
                document.getElementById("rep_" + this._id).disabled = true;
            }
        },
        'click .btn-save': function () {
            event.preventDefault();
            if (document.getElementById("Txt-rep" + id).value == "") {
                document.getElementById("loicmt_" + this._id).innerHTML = "Bạn chưa nhập bình luận !!"
            } else {
                let val = $("#Txt-rep" + id).val();

                Meteor.call("CommentCollection.addReplyToComment", this._id, val, id);
                document.getElementById("save_" + this._id).style.display = "none";
                document.getElementById("Txt-rep" + id).style.display = "none";
                document.getElementById("loicmt_" + this._id).innerHTML = "";
                document.getElementById("rep_" + this._id).disabled = false;
            }
        }

    });

    ///////////////////////////
    Template.paginationInUserManagement.events({
        "click .goPage": function () {
            BlazeLayout.reset();
        }
    })
    Template.paginationInUserManagement.helpers({
        prevPage: function () {
            var previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
            return PATH_JOB_PAGE + previousPage;
        },
        nextPage: function () {
            var nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
            return PATH_JOB_PAGE + nextPage;
        },
        pageNumbers: function () {
            return paginationDataGeneration(paginationMoreMode(), currentPage(), getNumberOfPage());
        },
        link: function () {
            return PATH_JOB_PAGE;
        },
        paginationMoreMode: function () {
            return paginationMoreMode();
        }
    })
    var hasMorePages = function () {
        var currentPage = parseInt(FlowRouter.current().params.page) || 1;
        var userCount = Counts.get('userCount');
        console.log("userCount= " + userCount);
        return currentPage * RECORD_PER_PAGE < userCount;
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
        let userCount = Counts.get('userCount');
        let numberOfPage = (userCount / RECORD_PER_PAGE) > Math.floor(userCount / RECORD_PER_PAGE)
            ? (Math.floor(userCount / RECORD_PER_PAGE) + 1) : Math.floor(userCount / RECORD_PER_PAGE);
        return numberOfPage;
    }
}
