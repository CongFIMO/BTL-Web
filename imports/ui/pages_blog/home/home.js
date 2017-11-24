import "./home.html";
import {Post} from "../../../startup/both/postCollection";
import {formatDate} from "../../../helpers/formatdate";
import {postSummary} from "../../../helpers/postsummary";
import {titleSummary} from "../../../helpers/titlesummary";
const record_per_page = 5;
const number_of_visible_page = 5;
if (Meteor.isClient) {
    var skipCount = 1;
    ReactiveTabs.createInterface({
        template: 'basicTabs',
        onChange: function (slug, template) {
            // This callback runs every time a tab changes.
            // The `template` instance is unique per {{#basicTabs}} block.
            console.log('[tabs] Tab has changed! Current tab:', slug);
            console.log('[tabs] Template instance calling onChange:', template);
        }
    });
    Template.App_home_blog.onCreated(function () {
        var template = this;

        template.autorun(function () {
            skipCount = (currentPage() - 1) * record_per_page;
            template.subscribe('postPagination', skipCount);
            //
            if (currentPage() === 1) {
                $('#prevPage').css("pointer-events", "none");
                console.log("currentpage=1");
            }
            if (currentPage() === getNumberOfPage()) {
                $('#nextPage').css("pointer-events", "none");
                console.log("currentpage=n");
            }

        });

    });
    Template.App_home_blog.onRendered(function () {
        $(document).ready(function () {
            if (currentPage() === 1) {
                $('#prevPage').css("pointer-events", "none");
                console.log("currentpage=1");
            }
            if (currentPage() === getNumberOfPage()) {
                $('#nextPage').css("pointer-events", "none");
                console.log("currentpage=n");
            }

        })
    });
    Template.App_home_blog.helpers({
            tabs: function () {
                // Every tab object MUST have a name and a slug!
                return [
                    {name: 'Recent', slug: 'recent'},
                    {name: 'Popular', slug: 'popular'},
                    {
                        name: 'Featured', slug: 'featured', onRender: function (slug, template) {
                        // This callback runs every time this specific tab's content renders.
                        // As with `onChange`, the `template` instance is unique per block helper.
                        // alert("[tabs] Things has been rendered!");
                    }
                    }
                ];
            },
            activeTab: function () {
                // Use this optional helper to reactively set the active tab.
                // All you have to do is return the slug of the tab.

                // You can set this using an Iron Router param if you want--
                // or a Session variable, or any reactive value from anywhere.

                // If you don't provide an active tab, the first one is selected by default.
                // See the `advanced use` section below to learn about dynamic tabs.
                return Session.get('activeTab'); // Returns "people", "places", or "things".
            },
            'postSummarizations': function () {
                let data=  Post.find({}).fetch();
                data.forEach(function (element) {
                    element.date = formatDate(element.date, false);
                    element.content = postSummary( element.content);
                });
                return data;
                // return Post.find({}, {
                //     limit: 5,
                //     skip: skipCount
                // });
            },
            prevPage: function () {
                var previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
                return "/blog/page/" + previousPage;
            },
            nextPage: function () {
                var nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
                return "/blog/page/" + nextPage;
            },
            pageNumbers: function () {
                let postCount = Counts.get('postCount');
                let pages = [];
                if (paginationMoreMode()) {
                    if (currentPage() === 1) {
                        return {
                            first: {'number': 1, class: 'current-page'},
                            preCurrent: {'number': 2, class: ''},
                            current: {'number': 3, class: ''},
                            postCurrent: {'number': 4, class: ''},
                            last: {'number': getNumberOfPage(), class: ''},
                            hasPre: false,
                            hasPost: true
                        }
                    }
                    else if (currentPage() === getNumberOfPage()) {
                        return {
                            first: {'number': 1, class: ''},
                            preCurrent: {'number': getNumberOfPage() - 3, class: ''},
                            current: {'number': getNumberOfPage() - 2, class: ''},
                            postCurrent: {'number': getNumberOfPage() - 1, class: ''},
                            last: {'number': getNumberOfPage(), class: 'current-page'},
                            hasPre: true,
                            hasPost: false
                        }
                    }
                    else if (currentPage() === 2 ||currentPage() ===3) {
                        return {
                            first: {'number': 1, class: ''},
                            preCurrent: {'number': 2, class: currentPage() ===2 ? 'current-page' : ""},
                            current: {'number': 3, class: currentPage() ===3 ? 'current-page' : ""},
                            postCurrent: {'number': 4, class: ''},
                            last: {'number': getNumberOfPage(), class: ''},
                            hasPre: false,
                            hasPost: true
                        }
                    }
                    else if (currentPage() === getNumberOfPage() - 1 ||currentPage()===getNumberOfPage()-2) {
                        return {
                            first: {'number': 1, class: ''},
                            preCurrent: {'number': getNumberOfPage() - 3, class: ''},
                            current: {'number': getNumberOfPage() - 2, class: currentPage() ===getNumberOfPage() - 2 ? 'current-page':""},
                            postCurrent: {'number': getNumberOfPage() - 1, class: currentPage() ===getNumberOfPage() - 1 ? 'current-page' : ""},
                            last: {'number': getNumberOfPage(), class: ''},
                            hasPre: true,
                            hasPost: false
                        }
                    }

                    return {
                        first: {'number': 1, class: ''},
                        preCurrent: {'number': currentPage() - 1, class: ''},
                        current: {'number': currentPage(), class: 'current-page'},
                        postCurrent: {'number': currentPage() + 1, class: ''},
                        last: {'number': getNumberOfPage(), class: ''},
                        hasPre: currentPage() - 1 === 1 ? false : true,
                        hasPost: currentPage() + 1 === getNumberOfPage() ? false : true
                    }
                }
                else
                {
                    for (let i = 1; i <= getNumberOfPage(); i++) {
                        pages.push({'number': i, class: currentPage() === i ? 'current-page' : ''});
                    }
                    return pages;
                }

            },
            paginationMoreMode: function () {
                return paginationMoreMode();
            }
            ,
            isCurrentPage: function () {

            }

        }
    )
    ;
    Template.App_home_blog.events({
        "click .goPage": function () {
            BlazeLayout.reset();
        }
    });
    Template.recent_post.helpers({
        'data': function () {
            let data = Post.find({}, {sort: {date: -1}, limit: 5}).fetch();
            data.forEach(function (element) {
                element.date = formatDate(element.date, false);
                element.content = postSummary( element.content);
                element.title = titleSummary(element.title);
            });
            return data;
        }
    });
    Template.popular_post.helpers({
        'data': function () {
            let data = Post.find({}, {sort: {numberOfView: -1}, limit: 5}).fetch();
            data.forEach(function (element) {
                element.date = formatDate(element.date, false);
                element.content = postSummary( element.content);
                element.title = titleSummary(element.title);
            });
            return data;
        }
    });
    Template.featured_post.helpers({
        'data': function () {
            let data =  Post.find({}, {sort: {count: -1}, limit: 5}).fetch();
            data.forEach(function (element) {
                element.date = formatDate(element.date, false);
                element.content = postSummary( element.content);
                element.title = titleSummary(element.title);
            });
            return data;
        }
    });
    var hasMorePages = function () {
        var currentcPage = parseInt(FlowRouter.current().params.page) || 1;
        var postCount = Counts.get('postCount');
        console.log("postCount= " + postCount);
        return currentPage * record_per_page < postCount;
    };
    var currentPage = function () {
        return parseInt(FlowRouter.current().params.page) || 1;
    };
    var paginationMoreMode = function () {
        if (getNumberOfPage() > number_of_visible_page)
            return true;
        return false;
    };
    var getNumberOfPage = function () {
        let postCount = Counts.get('postCount');
        let numberOfPage = (postCount / record_per_page) > Math.floor(postCount / record_per_page)
            ? (Math.floor(postCount / record_per_page) + 1) : Math.floor(postCount / record_per_page);
        // console.log("numberOfPage= "+ numberOfPage);
        return numberOfPage;
    }
}