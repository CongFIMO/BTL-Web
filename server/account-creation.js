import { Meteor } from 'meteor/meteor';

Accounts.onCreateUser(function(options, user) {
    // Use provided profile in options, or create an empty object
    user.profile = options.profile || {};
    user.milestone = options.milestone || {};

    // user.address = options.address || {};
    // Assigns first and last names to the newly created user object
    user.profile.full_name = options.full_name;
    // user.profile.phone = options.phone;
    // user.profile.gender = options.gender;
    // user.profile.id_card = options.id_card;
    // user.profile.age = options.age;
    // user.profile.address = options.address;
    // user.profile.info = options.info;

    // options.user_type = (options.user_type === null) ? 1 : options.user_type;
    user.profile.user_type = options.user_type;
    // console.log(options.user_type);
    user.profile.avatar = '';
    // user.profile.phone = '';
    // user.profile.address = '';
    user.profile.info = '';
    user.profile.join_date = Date.now();

    // Address
    // user.profile.province = '';
    // user.profile.district = '';
    // user.profile.home_address = '';

    // Milestone
    user.milestone.job_accepted = 0;
    user.milestone.time_workerd = 0;


    // Returns the user object
    // Organization
    user.profile.organization = ["Org"];
    //Basic Role Set Up
    var role = options.roles;
    // if (role )
    role = (role == null) ? ((options.user_type == 1) ? "owner" : "slave") : role;
    user.roles = [role];
    // if (role == 'slave') {
    //     user.profile.price = 25000;
    // }
    // console.log(user._id);
    // console.log(role);
    Roles.addUsersToRoles(user._id, role);
    // console.log(options);
    user.jobcat = options.jobcat;
    user.verified = false;

    return user;
});