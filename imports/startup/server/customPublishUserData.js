import { Meteor } from "meteor/meteor";
Meteor.publish(null, function() {
	if (this.userId) {
		return Meteor.users.find(
			{ _id: this.userId },
			{
				fields: {
					//   _id: 1,
					milestone: 1,
					createdAt: 1,
					// roles: 1
				}
			}
		);
	} else {
		this.ready();
	}
});