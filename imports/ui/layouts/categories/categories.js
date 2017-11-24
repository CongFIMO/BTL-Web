import './categories.html';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';
import  {Job} from '../../../startup/both/jobCollection.js';
import {JobCat} from "../../../startup/both/jobCatCollection";
import {JobType} from "../../../startup/both/jobTypeCollection";
import {Prov} from "../../../startup/both/province";
import Images from '../../../startup/both/images.collection.js';
import {splitURL} from "../../../helpers/splitURL";

if (Meteor.isClient) {
    Template.categories.onCreated(function () {
        Session.setDefault('avatarSubscribeReady', false);
        this.subscribe("avatar", {
            onReady: function() {
                Session.set('avatarSubscribeReady', true);
            }
        });
    });
    Template.categories.helpers({
        jobs : function () {
            var jobs =  Job.find({},{sort: {date_create: -1, cat_id: 1}, limit: 5});
            return jobs;
        },
        jobName : function (catID) {
            var jobcat = JobCat.findOne({_id: catID}, {fields: {name: 1},});
            var name  = jobcat && jobcat.name;
            return name;
        },
        catSlug : function (catID) {
            var jobcat = JobCat.findOne({_id: catID}, {fields: {name: 1, slug: 1},});
            var catSlug  = jobcat && jobcat.slug;
            return catSlug;
        },
        avatar : function (userID) {
            if (Session.get('avatarSubscribeReady')) {
                if (userID !== undefined) {
                    var avatar = Images.findOne({userId: userID});
                    if(avatar !== undefined) {
                        avatar = avatar.link();
                    } else {
                        return '#';
                    }
                    avatar = splitURL(avatar).pathname;
                    // console.log("Link: " + avatar);
                    return avatar;
                } else {
                    return '#';
                }
            }
        }
    });
}