import { Email } from 'meteor/email';
import {Meteor} from 'meteor/meteor';

Meteor.startup(function() {
    smtp = {
        username: "congtt97@gmail.com", // eg: server@gentlenode.com
        password: "calan1vn", // eg: 3eeP1gtizk5eziohfervU
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

});

Meteor.methods({
        sendEmail: function(to, subject, text) {
            // Make sure that all arguments are strings.
                // check([to, from, subject, text], [String]);
                    // Let other method calls from the same client start running, without
                        // waiting for the email sending to complete.
                            if (!Meteor.user())
                    throw new Meteor.Error(403, "not logged in");
            this.unblock();
            Email.send({ to: to, from: 'congtt97@gmail.com', subject: subject, text: text })
        }
});