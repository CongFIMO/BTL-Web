import {Mongo} from "meteor/mongo";
import { Session } from 'meteor/session'
export const Cmt = new Mongo.Collection('comment');
Cmt.allow({
    insert: function( name, date, author, postID){
        return true;
    },
    update: function(name, author,postID){
        return true;
    },
    remove: function (_id){
        return true;
    }
});
Meteor.methods({
    "CommentCollection.insert"(Comment, id){
        Cmt.insert({
            name: Comment,
            date: new Date(),
            author: Meteor.user().profile.full_name,
            postID: id
        });
    },
    "CommentCollection.remove"(_id){
        Cmt.remove({_id: _id});
    },
    "CommentCollection.updateName"(_id, name){
        Cmt.update(_id, {
            $set: {name: name},
        });
    },
    "CommentCollection.addReplyToComment"(cmtId, val, id){
        Cmt.update({_id: cmtId}, {
            $push: {
                replies: {
                    name: val,
                    author: Meteor.user().profile.full_name,
                    id: id
                }
            }
        });
    }
})
if (Meteor.isServer) {
    // Images.denyClient();
    Meteor.publish('comment', function () {
        return Cmt.find();
    });
    // Meteor.publish('cmtPage', function (skipCount, idPost) {
    //     // let postData = Session.get("currentPostData");
    //     // // if (!postData)
    //     // //     return;
    //
    //     Counts.publish(this, 'cmtCount',Cmt.find({postID:idPost}),{
    //         noReady:true
    //     } );
    //     return Cmt.find({postID:idPost},{
    //         sort:{
    //             date: -1
    //         },
    //         limit:5,
    //         skip:skipCount
    //     });
    // });
} else {
    Meteor.subscribe('comment');
}