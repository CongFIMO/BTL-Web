import { Meteor } from "meteor/meteor";
if (Meteor.isServer) {
    Meteor.publish("roles", function() {
		return Meteor.roles.find({});
	});
} else {
    return Meteor.subscribe("roles");
}