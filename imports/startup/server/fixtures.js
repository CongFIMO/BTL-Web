import { Meteor } from 'meteor/meteor';
Meteor.startup(() => {
    if (Meteor.users.find().count() === 0) {
        Accounts.createUser({
            username: 'adminHN',
            email: 'adminHN@clc.com',
            password: '123456',
            full_name: 'AdminHN',
            user_type: 0,
            roles: 'admin'
        });

        Accounts.createUser({
            username: 'adminDN',
            email: 'adminDN@clc.com',
            password: '123456',
            full_name: 'AdminDN',
            user_type: 0,
            roles: 'admin'
        });
    }
});
