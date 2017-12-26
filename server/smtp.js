import { Email } from 'meteor/email';
import {Meteor} from 'meteor/meteor';

Meteor.startup(function() {
    smtp = {
        username: "giupviecday@gmail.com", // eg: server@gentlenode.com
        password: "G1upv1ecD@y@!23", // eg: 3eeP1gtizk5eziohfervU
        server: "smtp.gmail.com", // eg: mail.gandi.net
        port: 587
    };

    process.env.MAIL_URL =
        "smtp://" +
        encodeURIComponent(smtp.username) +
        ":" +
        encodeURIComponent(smtp.password) +
        "@" +
        encodeURIComponent(smtp.server) +
        ":" +
        smtp.port;

    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl("reset-password/" + token);
    };

    Accounts.emailTemplates.resetPassword = {
        from: () => "reset@gvd.com",
        subject: () => "Reset Your Account Password",
        text: (user, url) => {
            const newUrl = url.replace("#/reset-password", "setpswd");
            return `Hi,Click the Link below to reset your password:\n${newUrl}`;
        }
    };


});

// https://gist.github.com/LeCoupa/9879221
// https://github.com/selaias/meteor-accounts-entry-flowrouter
// https://github.com/meteor-useraccounts/flow-routing

Meteor.methods({
    sendEmail: function(to, subject, text) {
        // Make sure that all arguments are strings.
        // check([to, from, subject, text], [String]);
        // Let other method calls from the same client start running, without
        // waiting for the email sending to complete.
        if (!Meteor.user())
            throw new Meteor.Error(403, "not logged in");
        this.unblock();
        Email.send({ to: to, from: 'giupviecday@gmail.com', subject: subject, text: text })
    }
});