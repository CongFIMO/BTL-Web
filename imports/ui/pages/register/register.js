import { Meteor } from 'meteor/meteor';
import './register.html';
import './register-field.js';
// import './register-form-style.js';
//

var messageLogError = function ($message) {
    
    Meteor.startup(function () {
        var options = {
            effect: 'flip',
            position: 'top',
            timeout: '2000',
            onRouteClose: false,
            stack: false,
            offset: '0'
        };
        sAlert.error($message,options);
    });
};


var mySubmitFunc = function (error, state) {
    if (error) {
        // console.log(error);
        Meteor.startup(function () {
            sAlert.error('Please try again!!!',
                {
                    effect: 'stackslide',
                    position: 'top',
                    timeout: '2000',
                    onRouteClose: false,
                    stack: false,
                    offset: '0'
                }
            );
        });
    }

    if (!error) {
        if (state === "signIn") {
            // Successfully logged in
            // ...
        }
        if (state === "signUp") {
            // Successfully registered
            // ...
            // console.log("ahihi");
            Meteor.startup(function () {
                sAlert.success('Register Success!!!',
                    {
                        effect: 'stackslide',
                        position: 'top',
                        timeout: '2000',
                        onRouteClose: false,
                        stack: false,
                        offset: '0'
                    }
                );
            });
            FlowRouter.go('/');
        }
    }
};
//
// AccountsTemplates.configure({
//     onSubmitHook: mySubmitFunc
// });

// Custom handle register
if (Meteor.isClient) {
    Template.register.events({
        'submit form': function(event){
            sAlert.closeAll();
            event.preventDefault();
            var emailVar = event.target.registerEmail.value;
            var passwordVar = event.target.registerPassword.value;
            var passwordAgainVar = event.target.registerAgainPassword.value;
            var fullNameVar = event.target.registerFullName.value;
            // var phoneVar = event.target.registerPhone.value;
            // var idCardVar = event.target.identityCard.value;
            // var ageVar = event.target.registerAge.value;
            // var addressVar = event.target.registerAddress.value;
            // var infoVar = event.target.registerInfo.value;
            var userTypeRegisterVar = event.target.userTypeRegister.value;

            // Trim Helper
            var trimInput = function(val) {
                return val.replace(/^\s*|\s*$/g, "");
                // return val.replace(/^[A-Z0-9\._%+-]+@[A-Z0-9\.-]+\.[A-Z]{2,}$/i, "");
            };
            var emailVar = trimInput(emailVar);
            // Check password is at least 6 chars long
            var isValidPassword = function(pwd, pwd2) {
                if (pwd === pwd2) {
                    if (pwd.length < 6) {
                        var $message = 'Mật khẩu quá ngắn!!!';
                        messageLogError($message);
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    // console.log('Error');
                    var $message = "Mật khẩu xác nhận không khớp!!!";
                    messageLogError($message);
                }
            };

            // You must agree to the Terms of Use and Privacy Policy

            console.log("Form submitted.");
            if (isValidPassword(passwordVar, passwordAgainVar)) {
                Accounts.createUser({
                    email: emailVar,
                    password: passwordVar,
                    full_name: fullNameVar,
                    user_type: userTypeRegisterVar
                }, function(error) {
                    if (error) {
                        // console.log(error);
                        messageLogError(error.reason);
                    } else {
                        FlowRouter.go('/');
                    }
                });
            }

        }
    });
}