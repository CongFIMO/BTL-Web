import { Meteor } from 'meteor/meteor';
import './login.html';

Template.login.events({
    'submit form': function(event) {
        sAlert.closeAll();
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        // console.log("Form submitted.");
        Meteor.loginWithPassword(emailVar, passwordVar, function(error){
            // console.log(error);
            // console.log(error.error);
            if (error) {
                if (error.error) {
                    // console.log(error);
                    Meteor.startup(function () {
                        $(document).ready(function(){
                            $('html, body').animate({
                                scrollTop: $("#topForm").offset().top
                            }, 500);
                        });
                        
                        sAlert.error('Username or Password Incorrect!!!',
                            {
                                effect: 'flip',
                                position: 'top',
                                timeout: '2000',
                                onRouteClose: false,
                                stack: false,
                                // stack: {
                                //     spacing: 2, // in px
                                //     limit: 1 // when fourth alert appears all previous ones are cleared
                                // },
                                offset: '0'
                            }
                        );
                    });
                }
            } else {
                // Meteor.startup(function () {
                //     sAlert.success('Đăng nhập thành công!!!',
                //         {
                //             effect: 'stackslide',
                //             position: 'top',
                //             timeout: '2000',
                //             onRouteClose: false,
                //             stack: false,
                //             offset: '0'
                //         }
                //     );
                // });
            }
        });
    }
});

var loginCheck = function (error, state) {
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
            FlowRouter.go('/');
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
