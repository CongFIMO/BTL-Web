// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/server/customPublishUserData.js';
import '/imports/startup/both/pubSubRoleUser.js';

import '/imports/startup/server/fixtures.js';
import '/imports/startup/both';
import './account-creation';
import './user-data-pubs';
import "/imports/startup/both/images.collection";

import "/imports/startup/both/comment";
import "/imports/startup/both/featureImageCollection";
import "/imports/helpers/formatdate";
import "/lib/collections/job-cat";


import  "../imports/startup/both/userCollection";

