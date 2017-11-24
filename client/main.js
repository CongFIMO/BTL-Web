import "./main.html";
import "/imports/startup/client";
// import '/imports/startup/client/routes.js';
import "/imports/startup/both";
import "/imports/startup/both/pushNotification";
import "/imports/startup/both/userNotifications";
import "/imports/startup/both/pubSubRoleUser";

const JOB_CATEGORY_PATH =  '/job-category';
const JOB_TYPE_PATH =  '/job-type';
const JOB_CREATION_PATH =  '/job-creation';
const JOIN_PATH = '/join';

Tracker.autorun(function () {
    FlowRouter.watchPathChange();
    var currentContext = FlowRouter.current();

    // console.log(currentContext);
    var currentPath = FlowRouter.current().path;
    // console.log(currentPath);
    // var route = FlowRouter.current().route.pathDef;
    // console.log(route);
    if (currentPath === JOIN_PATH && Meteor.user() !== null) {
        FlowRouter.redirect('/');
    }
    if (currentPath === JOB_CATEGORY_PATH
        || currentPath === JOB_TYPE_PATH
        || currentPath === JOB_CREATION_PATH) {
        // console.log('Path true');
        if (!Meteor.userId()) { // reactive
            // Session.set('returnAfterLogin', path);
            // whereTo = "/join";
            // or store return path as a query parameter
            //whereTo = "/entry/login?returnTo=#{path}"
            FlowRouter.redirect(JOIN_PATH);
        }
    }
    // console.log(currentContext);
    // do anything with the current context
    // or anything you wish
});