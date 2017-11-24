import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Images from '../../../startup/both/images.collection.js';
import './upload.html';

Template.uploadedFiles.helpers({
    uploadedFiles: function () {
        return Images.find();
    },
});

Template.avatarProfile.helpers({
    avatarProfile: function () {
        var imageProfile = Images.findOne({'userId': Meteor.userId()},
            {fields:
                {
                    _id: 1,
                    name: 1,
                    _downloadRoute: 1,
                    _collectionName: 1,
                    _storagePath: 1,
                    extensionWithDot: 1
                }
            }
        );
        // console.log(imageProfile);
        return imageProfile;
    }
});

Template.uploadForm.onCreated(function () {
    this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
    currentUpload: function () {
        return Template.instance().currentUpload.get();
    }
});

Template.uploadForm.events({
    'change #fileInput': function (e, template) {
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            // We upload only one file, in case
            // there was multiple files selected
            var file = e.currentTarget.files[0];
            if (file) {
                var uploadInstance = Images.insert({
                    file: file,
                    streams: 'dynamic',
                    chunkSize: 'dynamic'
                }, false);

                uploadInstance.on('start', function() {
                    template.currentUpload.set(this);
                });

                uploadInstance.on('end', function(error, fileObj) {
                    if (error) {
                        window.alert('Error during upload: ' + error.reason);
                    } else {
                        // window.alert('File "' + fileObj.name + '" successfully uploaded');
                        console.log('File "' + fileObj.name + '" successfully uploaded');
                    }
                    template.currentUpload.set(false);
                });

                uploadInstance.start();
            }
        }
    }
});
