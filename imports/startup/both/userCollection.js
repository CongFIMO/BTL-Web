if (Meteor.isServer) {
    Meteor.publish('listUser', function (skipCount, jobcat) {
        Counts.publish(this, 'userCount', Meteor.users.find({jobcat: jobcat
           }), {
            noReady: true
        });

        return Meteor.users.find({jobcat: jobcat}, {
            sort:{
                createdAt: -1
            },
            limit: 10,
            skip: skipCount
        });
    });

} else {
    Tracker.autorun(function () {
        var routeName = FlowRouter.getRouteName();
        if (routeName && routeName === "App.jobDetail") {
            // console.log("App.user-management");
            // Meteor.subscribe('listUser');
        }
    });

}
Meteor.methods({
    "Meteor.users.updateUserInfo": function (_id, profile) {
        return Meteor.users.update({_id: _id},
            {$set: {profile: profile}}, function (error, id) {
                if (error) {
                    console.log('update Fail!!!: ' + error); //info about what went wrong
                    return "error";
                }
                if (id) {
                    console.log('update Success!!!'); //the _id of new object if successful
                    // console.log(id);
                    return id;
                }
            });
    },
    "Meteor.users.deleteUser": function (_id) {
        Meteor.users.remove({_id: _id}, function (error, id) {
            if (error) {
                console.log('update Fail!!!: ' + error); //info about what went wrong
                return "error";
            }
            if (id) {
                console.log('update Success!!!'); //the _id of new object if successful
                // console.log(id);
                return id;
            }
        });
    },
    "Meteor.users.banUser": function (_id, msg) {
        return Meteor.users.update({_id: _id},
            {$set: {ban: {status: true, reason: msg}}}, function (error, id) {
                if (error) {
                    console.log('update Fail!!!: ' + error); //info about what went wrong
                    return "error";
                }
                if (id) {
                    console.log('update Success!!!'); //the _id of new object if successful
                    // console.log(id);
                    return id;
                }
            });
    },
    "Meteor.users.unbanUser": function (_id, msg) {
        return Meteor.users.update({_id: _id},
            {$set: {ban: {status: false, reason: msg}}}, function (error, id) {
                if (error) {
                    console.log('update Fail!!!: ' + error); //info about what went wrong
                    return "error";
                }
                if (id) {
                    console.log('update Success!!!'); //the _id of new object if successful
                    // console.log(id);
                    return id;
                }
            });
    }
})