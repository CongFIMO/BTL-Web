import {Meteor} from "meteor/meteor";
import {PostCat} from "../../../startup/both/postCatCollection";
import {Post} from "../../../startup/both/postCollection";
import "./category.html";
if (Meteor.isClient) {
    Template.category.helpers({
        'categoryData': function () {
            let current = FlowRouter.current();
            let slug = current.params.slug;

            let postIds = [];
            let category = PostCat.findOne({slug: slug}, {});
            postIds = category.postIds;

            let postTitles = [];
            let posts = Post.find({id: {$in: postIds}});
            posts.forEach(function (element) {
                postTitles.push({title: element.title, id: element.id});
            });
            return {
                postTitles: postTitles,
                categoryName: category.name
            };
        },
    });
}