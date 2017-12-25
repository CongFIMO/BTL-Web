import {Mongo} from 'meteor/mongo';
// import {Session} from 'meteor/session';
export const Job = new Mongo.Collection('job');

Meteor.methods({
        // 'numberUserFindJob': function numberUserFindJob() {
        //     Session.set('numberUserFindJob',Meteor.users.find().count());
        // },
        "JobCollection.updateUserRegisteredList"(jobID, user_registered)
        {
            return Job.update({_id: jobID}, {$set: {user_registered: user_registered}});
        },

        "JobCollection.updateUserRegistered"(jobID, currentUser){
            return Job.update({_id: jobID}, {$addToSet: {user_registered: currentUser}});
        },

        "JobCollection.updateUserRelated"(jobID, user){
            return Job.update({_id: jobID}, {$addToSet: {user_related: user}});
        },

        "JobCollection.updateUserRelatedList"(jobID, user)
        {
            return Job.update({_id: jobID}, {$set: {user_related: user}});
        },

        "JobCollection.updateAcceptedUser"(jobID, user_id_accepted){
            return Job.update({_id: jobID}, {$set: {user_id_accepted: user_id_accepted, status: 'ACCEPTED'}});
        },

        "JobCollection.updateStatus"(jobID, jobStatus){
            return Job.update({_id: jobID}, {$set: {status: jobStatus}});
        },
        "JobCollection.updateRating"(jobID, jobRating){
            return Job.update({_id: jobID}, {$set: {rating: jobRating}});
        },
        "JobCollection.updateMultipleField"(jobID, jobCatID, jobDescription,
                                            jobDateStart,
                                            jobDateEnd, jobName, jobStatus, jobPref, jobCatName)
        {
            return Job.update({_id: jobID},
                {
                    $set: {
                        name: jobName,
                        //job_group: jobChecked,
                        cat_id: jobCatID,
                        cat_name: jobCatName,
                        date_modified: new Date(),
                        description: jobDescription,
                        date_start: jobDateStart,
                        //time_start: jobTimeStart,
                        date_end: jobDateEnd,
                        name: jobName,
                        status: jobStatus,
                        preference: jobPref

                    }
                }, function (error, result) {
                    if (error) {
                        console.log('update Fail!!!: ' + error); //info about what went wrong
                        return "error";
                    }
                    if (result) {
                        console.log('update Success!!!'); //the _id of new object if successful
                        return "success";
                    }
                }
            );
        },
        "JobCollection.removeJob"(id){
            return Job.remove({_id: id}, function (err, result) {
                if (err) {
                    console.log('Remove Fail!!!: ' + error);
                    return "error";
                }
                if (result) {
                    console.log('Remove Success!!!');
                    return "success";
                }
            });
        },
        "JobCollection.insert"(jobCatID, jobStatus, currentUserID,
                               user, jobDescription, jobDateStart, jobName,
                               jobDateEnd, jobPref, jobCatName)
        {
            return Job.insert(
                {
                    //job_group: jobChecked,
                    cat_id: jobCatID,
                    cat_name: jobCatName,
                    name: jobName,
                    status: jobStatus,
                    user_id: currentUserID,
                    user: user,
                    user_id_accepted: 0,
                    date_create: new Date(),
                    description: jobDescription,
                    date_start: jobDateStart,
                    //time_start: jobTimeStart,
                    date_end: jobDateEnd,
                    preference: jobPref

                }, function (error, id) {
                    if (error) {
                        console.log('Insert Fail!!!: ' + error); //info about what went wrong
                        return "error";
                    }
                    if (id) {
                        console.log('Insert Success!!!'); //the _id of new object if successful
                        // console.log(id);
                        return id;
                    }
                }
            );
        }
    },
)

if (Meteor.isServer) {
    Meteor.publish('jobs', function () {
        if (Meteor.user()) {
            return Job.find();
        }
        // console.log("get all job");
    });
    Meteor.publish('jobPagination', function (skipCount) {
        if (Roles.userIsInRole(Meteor.userId(), ['slave'])) {
            Counts.publish(this, 'jobCount', Job.find({user_id: Meteor.userId()}), {
                noReady: true
            });

            Counts.publish(this, 'newJobCount', Job.find({status: 'New', user_id: Meteor.userId()}), {
                noReady: true
            });
            Counts.publish(this, 'inprogressJobCount', Job.find({status: 'Inprogress', user_id: Meteor.userId()}), {
                noReady: true
            });
            Counts.publish(this, 'resolvedJobCount', Job.find({status: 'Resolved', user_id: Meteor.userId()}), {
                noReady: true
            });
            Counts.publish(this, 'feedbackJobCount', Job.find({status: 'Feedback', user_id: Meteor.userId()}), {
                noReady: true
            });
            Counts.publish(this, 'closedJobCount', Job.find({status: 'Closed', user_id: Meteor.userId()}), {
                noReady: true
            });

            // console.log("get job for owner")
            return Job.find({user_id: Meteor.userId()}, {
                sort: {
                    date_create: -1,
                    cat_id: 1
                },
                limit: 5,
                skip: skipCount
            });
        }
        else {
            Counts.publish(this, 'jobCount', Job.find(), {
                noReady: true
            });
            Counts.publish(this, 'newJobCount', Job.find({status: 'New'}), {
                noReady: true
            });
            Counts.publish(this, 'inprogressJobCount', Job.find({status: 'Inprogress'}), {
                noReady: true
            });
            Counts.publish(this, 'resolvedJobCount', Job.find({status: 'Resolved'}), {
                noReady: true
            });
            Counts.publish(this, 'feedbackJobCount', Job.find({status: 'Feedback'}), {
                noReady: true
            });
            Counts.publish(this, 'closedJobCount', Job.find({status: 'Closed'}), {
                noReady: true
            });
            return Job.find({}, {
                sort: {
                    date_create: -1,
                    cat_id: 1
                },
                limit: 5,
                skip: skipCount
            });
        }

    });
    Meteor.publish('jobPaginationInJobIT', function (skipCount) {
        Counts.publish(this, 'jobCount', Job.find({}), {
            noReady: true
        });

        Counts.publish(this, 'newJobCount', Job.find({status: 'New'}), {
            noReady: true
        });
        Counts.publish(this, 'inprogressJobCount', Job.find({status: 'Inprogress'}), {
            noReady: true
        });
        Counts.publish(this, 'resolvedJobCount', Job.find({status: 'Resolved'}), {
            noReady: true
        });
        Counts.publish(this, 'feedbackJobCount', Job.find({status: 'Feedback'}), {
            noReady: true
        });
        Counts.publish(this, 'closedJobCount', Job.find({status: 'Closed'}), {
            noReady: true
        });
        console.log("get job for owner")
        return Job.find({}, {
            sort: {
                date_create: -1,
                cat_id: 1
            },
            limit: 5,
            skip: skipCount
        });

    });

    Meteor.publish('jobPaginationInJobList', function (skipCount, catName) {
        // console.log("server cat id= "+ cat_id);
        Counts.publish(this, 'jobCount', Job.find({cat_name: catName}), {
            noReady: true
        });

        Counts.publish(this, 'newJobCount', Job.find({status: 'New', cat_name: catName}), {
            noReady: true
        });
        Counts.publish(this, 'inprogressJobCount', Job.find({status: 'Inprogress', cat_name: catName}), {
            noReady: true
        });
        Counts.publish(this, 'resolvedJobCount', Job.find({status: 'Resolved', cat_name: catName}), {
            noReady: true
        });
        Counts.publish(this, 'feedbackJobCount', Job.find({status: 'Feedback', cat_name: catName}), {
            noReady: true
        });
        Counts.publish(this, 'closedJobCount', Job.find({status: 'Closed', cat_name: catName}), {
            noReady: true
        });

        // console.log("get job for owner")
        return Job.find({cat_name: catName}, {
            sort: {
                date_create: -1
                // cat_id: 1
            },
            limit: 5,
            skip: skipCount
        });
    });
    Meteor.publish('jobPaginationInJobCreated', function (skipCount) {
        Counts.publish(this, 'jobCount', Job.find({user_id: Meteor.userId()}), {
            noReady: true
        });

        Counts.publish(this, 'newJobCount', Job.find({status: 'New', user_id: Meteor.userId()}), {
            noReady: true
        });
        Counts.publish(this, 'inprogressJobCount', Job.find({status: 'Inprogress', user_id: Meteor.userId()}), {
            noReady: true
        });
        Counts.publish(this, 'resolvedJobCount', Job.find({status: 'Resolved', user_id: Meteor.userId()}), {
            noReady: true
        });
        Counts.publish(this, 'feedbackJobCount', Job.find({status: 'Feedback', user_id: Meteor.userId()}), {
            noReady: true
        });
        Counts.publish(this, 'closedJobCount', Job.find({status: 'Closed', user_id: Meteor.userId()}), {
            noReady: true
        });

        // console.log("get job for owner")
        return Job.find({user_id: Meteor.userId()}, {
            sort: {
                date_create: -1,
                cat_id: 1
            },
            limit: 5,
            skip: skipCount
        });

    });
    Meteor.publish('jobPaginationInJobAssigned', function (skipCount) {
        Counts.publish(this, 'jobCount', Job.find({user_registered: {$elemMatch: {_id: Meteor.userId()}}}), {
            noReady: true
        });

        Counts.publish(this, 'newJobCount', Job.find({status: 'New',user_registered: {$elemMatch: {_id: Meteor.userId()}}}), {
            noReady: true
        });
        Counts.publish(this, 'inprogressJobCount', Job.find({status: 'Inprogress', user_registered: {$elemMatch: {_id: Meteor.userId()}}}), {
            noReady: true
        });
        Counts.publish(this, 'resolvedJobCount', Job.find({status: 'Resolved', user_registered: {$elemMatch: {_id: Meteor.userId()}}}), {
            noReady: true
        });
        Counts.publish(this, 'feedbackJobCount', Job.find({status: 'Feedback', user_registered: {$elemMatch: {_id: Meteor.userId()}}}), {
            noReady: true
        });
        Counts.publish(this, 'closedJobCount', Job.find({status: 'Closed', user_registered: {$elemMatch: {_id: Meteor.userId()}}}), {
            noReady: true
        });

        // console.log("get job for owner")
        return Job.find({user_registered: {$elemMatch: {_id: Meteor.userId()}}},
                {
                    limit: 5,
                    skip: skipCount
                });
    });
    Meteor.publish('jobPaginationInJobRelated', function (skipCount) {
        Counts.publish(this, 'jobCount', Job.find({user_related: {$elemMatch: {_id: Meteor.userId()}}}), {
            noReady: true
        });

        Counts.publish(this, 'newJobCount', Job.find({status: 'New',
            user_related: {$elemMatch: {_id: Meteor.userId()}}}), {
            noReady: true
        });
        Counts.publish(this, 'inprogressJobCount', Job.find({status: 'Inprogress',
            user_related: {$elemMatch: {_id: Meteor.userId()}}}), {
            noReady: true
        });
        Counts.publish(this, 'resolvedJobCount', Job.find({status: 'Resolved',
            user_related: {$elemMatch: {_id: Meteor.userId()}}}), {
            noReady: true
        });
        Counts.publish(this, 'feedbackJobCount', Job.find({status: 'Feedback',
            user_related: {$elemMatch: {_id: Meteor.userId()}}}), {
            noReady: true
        });
        Counts.publish(this, 'closedJobCount', Job.find({status: 'Closed',
            user_related: {$elemMatch: {_id: Meteor.userId()}}}), {
            noReady: true
        });

        // console.log("get job for owner")
        return    Job.find({user_related: {$elemMatch: {_id: Meteor.userId()}}},{
            limit: 5,
            skip: skipCount
        });
    });
} else {
    Tracker.autorun(function () {
        var routeName = FlowRouter.getRouteName();
        console.log("routeName= " + routeName);
        if (routeName && (routeName === "App.job-list" || routeName === "App.job-IT")) {
            console.log("routeName && routeName===App.job-list");
        }
        //normal sub mode
        else Meteor.subscribe('jobs');
    });

}

export default Job;