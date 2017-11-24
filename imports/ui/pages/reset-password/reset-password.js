import "./reset-password.html";
// Do not forget to add the email package: $ meteor add email
// and to configure the SMTP: https://gist.github.com/LeCoupa/9879221
//  https://gist.github.com/LeCoupa/9879066#gistcomment-2069672 

import {utilities} from "../../../helpers/utilities.js";
import {messageLogError} from "../../../partials/messages-error";
import {messageLogSuccess} from "../../../partials/messages-success";


Template.ForgotPassword.events({
	"submit #forgotPasswordForm": function(e, t) {
		e.preventDefault();
		var forgotPasswordForm = $(e.currentTarget),
			email = utilities.trimInput(
				forgotPasswordForm
					.find("#forgotPasswordEmail")
					.val()
					.toLowerCase()
			);

		if (!utilities.isEmpty(email) && utilities.isEmail(email)) {
			Accounts.forgotPassword({ email: email }, function(err) {
				if (err) {
					if (err.message === "User not found [403]") {
						// console.log("This email does not exist.");
						messageLogError('Không tồn tại Email này!');
					} else {
						messageLogError('Bạn thực hiện thao tác quá nhanh hoặc nhập chưa đúng Email');
						// console.log("We are sorry but something went wrong.");
					}
				} else {
					messageLogSuccess('Email đã được gửi tới địa chỉ '  + email + ' vui lòng check Mail để đổi mật khẩu');
					// console.log("Email Sent. Check your mailbox.");
				}
			});
		}
		return false;
	}
});

Template.ResetPassword.onCreated(function() {
	if (Accounts._resetPasswordToken) {
		Session.set("resetPassword", Accounts._resetPasswordToken);
		// console.log("ResetPasswordtemplate : " + resetPassword);
	}
});

Template.ResetPassword.helpers({
	resetPassword: function() {
		var resetPassword = FlowRouter.getParam("token");
		return resetPassword;
	}
});

Template.ResetPassword.events({
	"submit #resetPasswordForm": function(e, t) {
		e.preventDefault();
		var resetPassword = FlowRouter.getParam('token');
		var resetPasswordForm = $(e.currentTarget),
			password = resetPasswordForm.find("#resetPasswordPassword").val(),
			passwordConfirm = resetPasswordForm.find("#resetPasswordPasswordConfirm").val();

		// Error Message
		if(utilities.isEmpty(password)) {
			messageLogError('Mật khẩu không được để trống');
		}
		if(!utilities.isValidPassword(password, passwordConfirm)) {
			messageLogError('Mật khẩu phải giống nhau và gồm ít nhất 6 ký tự');
		}
			
		if (!utilities.isEmpty(password) && utilities.isValidPassword(password, passwordConfirm)) {
			Accounts.resetPassword(resetPassword,password, function(err) {
				if (err) {
					console.log("We are sorry but something went wrong.");
				} else {
					console.log(
						"Your password has been changed. Welcome back!"
					);
					Session.set("resetPassword", null);
					FlowRouter.go('/');
				}
			});
		}
		return false;
	}
});
