// /**
//  * Created by mywill on 12/10/17.
//  */
// import { Meteor }          from 'meteor/meteor';
// import { FilesCollection } from 'meteor/ostrio:files';
//
// const  FeaturedImages = new FilesCollection({
//     debug: true,
//     collectionName: 'FeaturedImages',
//     storagePath: '/tmp/UploadedFiles/FeaturedImages',
//     allowClientCode: false, // Disallow remove files from Client
//     onBeforeUpload: function (file) {
//         // Allow upload files under 10MB, and only in png/jpg/jpeg formats
//         if (file.size <= 1024 * 1024 * 10 && /png|jpe?g/i.test(file.extension)) {
//             return true;
//         }
//         return 'Please upload image, with size equal or less than 10MB';
//     },
//
// });
//
// if (Meteor.isServer) {
//     // Images.denyClient();
//     Meteor.publish('files.featureimages.all', function () {
//         return FeaturedImages.find().cursor;
//     });
// } else {
//     Meteor.subscribe('files.featureimages.all');
// }
// export default FeaturedImages;
