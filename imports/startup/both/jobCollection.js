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
            return Job.update({_id: jobID}, {$push: {user_registered: currentUser}});
        },
        "JobCollection.updateAcceptedUser"(jobID, user_id_accepted){
            return Job.update({_id: jobID}, {$set: {user_id_accepted: user_id_accepted, status: 'ACCEPTED'}});
        },
        "JobCollection.updateMultipleField"(jobID, jobChecked, jobCatID, jobDescription,
                                            selectTimeInterval, jobDateStart,
                                            jobDateEnd, jobName,jobStatus, jobPref )
        {
            return Job.update({_id: jobID},
                {
                    $set: {
                        job_group: jobChecked,
                        cat_id: jobCatID,
                        date_modified: new Date(),
                        description: jobDescription,
                        // time: selectJobTime,
                        //time_interval: selectTimeInterval,
                        date_start: jobDateStart,
                        //time_start: jobTimeStart,
                        date_end: (selectTimeInterval == 1) ? "" : jobDateEnd,
                        name : jobName,
                        status : jobStatus,
                        preference : jobPref
                        //time_end: jobTimeEnd,
                        //province: newProvinceAddress,
                        //district: newdisAddress,
                        //home: homeAddress
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
        "JobCollection.insert"(jobChecked, jobCatID, jobStatus, currentUserID,
                               user, jobDescription, jobDateStart,
                               jobDateEnd,jobPref)
        {
            return Job.insert(
                {
                    job_group: jobChecked,
                    cat_id: jobCatID,
                    status: jobStatus,
                    user_id: currentUserID,
                    user: user,
                    user_id_accepted: 0,
                    date_create: new Date(),
                    description: jobDescription,
                    // time: selectJobTime,
                   //time_interval: selectTimeInterval,
                    date_start: jobDateStart,
                    //time_start: jobTimeStart,
                    date_end: jobDateEnd,
                    preference: jobPref
                    //time_end: jobTimeEnd,
                    //province: newProvinceAddress,
                    //district: newdisAddress,
                    //home: homeAddress
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
        if (Roles.userIsInRole(Meteor.userId(), ['owner'])){
            return Job.find({user_id: Meteor.userId()});
            // console.log("get job for owner");
        }
        // console.log("get all job");
        return Job.find();
    });
        Meteor.publish('jobPagination', function (skipCount) {
        if (Roles.userIsInRole(Meteor.userId(), ['owner'])) {
            Counts.publish(this, 'jobCount', Job.find({user_id: Meteor.userId()}), {
                noReady: true
            });

            console.log("get job for owner")
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
            // console.log("get all jobPa");

            Counts.publish(this, 'jobCount', Job.find(), {
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
} else {
    Tracker.autorun(function () {
        var routeName = FlowRouter.getRouteName();
        console.log("routeName= "+ routeName);
        if (routeName && routeName==="App.job-list") {
            console.log("routeName && routeName===App.job-list");
        }
        //normal sub mode
        else Meteor.subscribe('jobs');
    });

}

export default Job;