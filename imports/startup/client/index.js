// Import client startup through a single index entry point

import './routes.js';

// Client
Meteor.subscribe('userData');

// Meteor.startup(function() {
//     $('#__blaze-root').each(function(){
//         $(this).contents().wrapAll('<div id="wrapper">');
//     })
// });
