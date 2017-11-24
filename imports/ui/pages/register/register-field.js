// import { Meteor } from 'meteor/meteor';
//
// AccountsTemplates.configure({
//     showForgotPasswordLink: true,
// });
//
// AccountsTemplates.addField({
//     _id: 'full_name',
//     type: 'text',
//     displayName: "Full Name",
//     placeholder: 'Full Name',
//     required: true,
// });
//
// AccountsTemplates.addField({
//     _id: "gender",
//     type: "select",
//     displayName: "Gender",
//     select: [
//         {
//             text: "Male",
//             value: "male",
//         },
//         {
//             text: "Female",
//             value: "female",
//         },
//     ],
// });
//
// AccountsTemplates.addField({
//     _id: 'info',
//     type: 'text',
//     displayName: "Info",
//     placeholder: 'Info',
//     // required: true,
// });
//
// AccountsTemplates.addField({
//     _id: 'address',
//     type: 'text',
//     displayName: "Address",
//     placeholder: 'Address',
//     // required: true,
// });
//
// AccountsTemplates.addField({
//     _id: 'age',
//     type: 'tel',
//     displayName: "Age",
//     placeholder: 'Age',
//     // required: true,
// });
//
// AccountsTemplates.addField({
//     _id: 'phone',
//     type: 'tel',
//     displayName: "Phone Number",
//     placeholder: "Phone Number",
//     // maxLength: 11,
//     // minLength: 10,
//     // required: true,
//     func: function (number) {
//         if (Meteor.isServer){
//             if (isValidPhone(number))
//                 return false; // meaning no error!
//             return true; // Validation error!
//         }
//     },
//     errStr: 'Invalid Phone number!',
// });
//
// AccountsTemplates.addField({
//     _id: 'student_id',
//     type: 'text',
//     displayName: "Student ID",
//     placeholder: 'Student ID',
//     // maxLength: 8,
//     // required: true,
// });
