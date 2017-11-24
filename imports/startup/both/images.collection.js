import {Meteor} from "meteor/meteor";
import {FilesCollection} from "meteor/ostrio:files";
import {splitURL} from "../../helpers/splitURL";

// import * as fs from 'fs-extra';

const Images = new FilesCollection({
    debug: true,
    collectionName: 'Images',
    storagePath: '/images/avatars/',
    allowClientCode: false, // Disallow remove files from Client
    onBeforeUpload: function (file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 1024 * 1024 * 10 && /png|jpe?g/i.test(file.extension)) {

            if (Meteor.isServer) {
                // Images.findOne({usedId: this.userId}).remove({});
                Images.remove({userId: this.userId}, function (error) {
                    if (error) {
                        console.error("File wasn't removed, error: " + error.reason)
                    } else {
                        console.info("File successfully removed");
                    }
                });
            }

            return true;
        }
        return 'Please upload image, with size equal or less than 10MB';
    },
    onAfterUpload: function (file) {
        var user = Meteor.users.findOne({ _id : file.userId });
        var profile = user.profile;
        var loadedPImg = Images.findOne({ _id : file._id }).link();
        // Update avatar image link
        loadedPImg = splitURL(loadedPImg).pathname;
        console.log("loadedPImg= "+ loadedPImg);
        profile.avatar = loadedPImg;
        Meteor.users.update(file.userId, {$set: {profile: profile}});
    }
});

if (Meteor.isServer) {
    // Images.denyClient();
    Meteor.publish('avatar', function () {
        return Images.find().cursor;
    });
} else {
    Meteor.subscribe('avatar');
}

export default Images;
