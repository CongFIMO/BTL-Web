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
	//   Reset password Meteor
	//   https://gist.github.com/lo-tp/f4bc627b4f7c4a37ee4ec68b4e981e2d
	// https://github.com/meteor/meteor/blob/be986fd70926c9dd8eff6d8866205f236c8562c4/packages/accounts-base/url_server.js
	//  https://github.com/meteor-useraccounts/iron-routing/issues/6
});

// https://gist.github.com/LeCoupa/9879221
// https://github.com/selaias/meteor-accounts-entry-flowrouter
// https://github.com/meteor-useraccounts/flow-routing

