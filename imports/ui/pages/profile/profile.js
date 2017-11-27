import {Meteor} from "meteor/meteor";
import "./profile.html";
// import {Prov} from "../../../startup/both/province";
import {utilities} from "../../../helpers/utilities.js";
import {messageLogError} from "../../../partials/messages-error";
import {messageLogSuccess} from "../../../partials/messages-success";
import {UserActivityHistory} from "../../../startup/both/userActivityHistoryCollection";
import {Job} from "../../../startup/both/jobCollection";
import {JobCat} from "../../../startup/both/jobCatCollection";
import {formatDate} from "../../../../imports/helpers/formatdate.js";

// Custom handle register
if (Meteor.isClient) {
    const RECORD_PER_PAGE = 10;
    const NUMBER_OF_VISIBLE_PAGE = 5;
    const USER_HISTORY_IN_PROFILE_LINK = "/profile/history/page/";
    var skipCount = 1;
    Session.setDefault("indexDis", 0);

    Template.profileAddress.helpers({
        'provinceAddress': function () {
            // console.log(Prov);
            return Prov;
        },
        'disAddress': function () {
            var index = Session.get("indexDis");
            return Prov[index].dis;
        },
        'provinceSelected': function (provinceName, index) {
            var selected = '';
            if (provinceName === Meteor.user().profile.province) {
                selected = 'selected';
                Session.set('indexDis', index);
            }
            return selected;
        },
        'disSelected': function (districtName, index) {
            var selected = '';
            if (districtName === Meteor.user().profile.district) {
                selected = 'selected';
            }
            return selected;
        }
    });

    Template.profileAddress.events({
        "change #provinceAddress": function (evt) {
            var provinceId = $(evt.target).val();
            Session.set("indexDis", provinceId);
        }
    });


    Template.profile.events({
        'submit form': function (event) {
            event.preventDefault();
            var nameUpdate = event.target.nameProfile.value;
            var phoneUpdate = event.target.phoneProfile.value;
            var infoUpdate = event.target.infoProfile.value;

            var provinceAddressUpdate = event.target.provinceAddress.value;
            var disAddressUpdate = event.target.disAddress.value;
            var homeAddressUpdate = event.target.homeAddressProfile.value;

            //console.log(Prov[provinceAddress].name);
            var provinceAddress = Prov[provinceAddressUpdate].name;
            // console.log(Prov[provinceAddress].dis[disAddress]);
            var disAddress = Prov[provinceAddressUpdate].dis[disAddressUpdate];

            console.log("Form submitted.");

            var avtimage = document.getElementById('avatar-profile');
            avtimage = avtimage.src;

            var url = new URL(avtimage);
            avtimage = url.pathname;
            // console.log(avtimage.pathname);
            var updateProfile = Meteor.user().profile;
            updateProfile.full_name = nameUpdate;
            updateProfile.phone = phoneUpdate;
            if (Roles.userIsInRole(Meteor.userId(), ['slave'])) {
                var priceUpdate = event.target.priceProfile.value;
                updateProfile.price = priceUpdate;
                // console.log('Get Price');
            }
            updateProfile.info = infoUpdate;

            updateProfile.province = provinceAddress;
            updateProfile.district = disAddress;
            updateProfile.home_address = homeAddressUpdate;
            updateProfile.avatar = avtimage;

            Meteor.users.update(Meteor.userId(), {$set: {profile: updateProfile}});
        },
        "click .profile_section": function (evt) {
            let sectionName = $(evt.target).attr('id');
            Session.set("currentProfileSection", sectionName);
        }
    });

    // User Collection
    Meteor.users.after.update(function (userId, doc, fieldNames, modifier, options) {
        var $message = "Cập nhật thông tin cá nhân thành công!";
        // console.log($message);
        messageLogSuccess($message);
    }, {fetchPrevious: false});

    Template.profile.helpers({
        isInProfileInfo: function () {
            var currentSection = Session.get("currentProfileSection");
            if (!currentSection)
                currentSection = FlowRouter.current().params.section
                    ? FlowRouter.current().params.section : "profile_info";
            return currentSection === "profile_info";
        },
        isInNoti: function () {
            var currentSection = Session.get("currentProfileSection");
            if (!currentSection)
                currentSection = FlowRouter.current().params.section;
            return currentSection === "notification";
        },
        isInHistory: function () {
            var currentSection = Session.get("currentProfileSection");
            if (!currentSection)
                currentSection = FlowRouter.current().params.section;
            return currentSection === "history";
        },
        isInPasswordChaging: function () {
            var currentSection = Session.get("currentProfileSection");
            if (!currentSection)
                currentSection = FlowRouter.current().params.section;
            // console.log("section = "+ currentSection);
            return currentSection === "change_password";
        },
        setDefaultSelectedSection: function () {
            var section = FlowRouter.current().params.section;
            return section ? "" : "active";
        }
    });
    Template.profile.onCreated(function () {
            // var section = FlowRouter.current().params.section;
            // console.log("section = "+ section);
            // Session.setDefault("currentProfileSection", section ? section : "profile_info");
        }
    );
    Template.change_pass_in_profile.events({
        "submit form": function (event) {
            event.preventDefault();
            var currentPassword = event.target.currentPassword.value;
            var newPassword = event.target.newPassword.value;
            var newPasswordConfirm = event.target.newPasswordConfirm.value;
            // Error Message
            if (utilities.isEmpty(currentPassword)
                || utilities.isEmpty(newPassword)
                || utilities.isEmpty(newPasswordConfirm)) {
                messageLogError('Hãy nhập đầy đủ các trường!');
                return;
            }
            if (!utilities.isValidPassword(newPassword, newPasswordConfirm)) {
                messageLogError('Mật khẩu phải giống nhau và gồm ít nhất 6 ký tự');
                return;
            }
            Accounts.changePassword(currentPassword, newPassword, function (err) {
                if (err) {
                    messageLogError("Mật khẩu hiện tại chưa đúng!");
                }
                else {
                    messageLogSuccess("Đổi mật khẩu thành công");
                    event.target.currentPassword.value = "";
                    event.target.newPassword.value = "";
                    event.target.newPasswordConfirm.value = "";
                }
            })
        }
    });
    Template.history_in_profile.helpers({
        data: function () {
            //get user activity history data
            var data = UserActivityHistory.find
            (
                {userId: Meteor.userId()},
                {sort: {time_create: -1}, limit: RECORD_PER_PAGE, skip: skipCount}
            )
                .fetch()
            ;
            var listJobId = [];//save list job id
            if (data) {
                //style time_create, build listJobId
                data.forEach(function (element) {
                    element.time_create = formatDate(element.time_create);
                    listJobId.push(element.referId);
                });
                //get job info from db
                var jobData =Job.find({_id: {$in: listJobId}},
                    {fields: {cat_id: 1}}).fetch();

                var listCatId= [];
                //build listCatId
                jobData.forEach(function (element) {
                    listCatId.push(element.cat_id);
                });
                //get JobCat data
                var catData = JobCat.find({_id : {$in: listCatId}},
                    {fields: {slug: 1}}).fetch();
                //add cat_slug to jobData
                catData.forEach(function (catElement) {
                    jobData.forEach(function (jobElement) {
                        if (jobElement.cat_id=== catElement._id){
                            jobElement.cat_slug = catElement.slug;
                        }
                    })
                });
                //add cat_slug to uahData
                jobData.forEach(function (jobElement) {
                    data.forEach(function (uahElement) {
                        if (uahElement.referId=== jobElement._id){
                            uahElement.cat_slug = jobElement.cat_slug;
                        }
                    })
                })
            }

            return data;
        },
        prevPage: function () {
            var previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
            return USER_HISTORY_IN_PROFILE_LINK + previousPage;
        },
        nextPage: function () {
            var nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
            return USER_HISTORY_IN_PROFILE_LINK + nextPage;
        },
        pageNumbers: function () {
            let uahCount = Counts.get('uahCount');
            // console.log("uahCOunt = " + uahCount);
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
                else if (currentPage() === 2 || currentPage() === 3) {
                    return {
                        first: {'number': 1, class: ''},
                        preCurrent: {'number': 2, class: currentPage() === 2 ? 'current-page' : ""},
                        current: {'number': 3, class: currentPage() === 3 ? 'current-page' : ""},
                        postCurrent: {'number': 4, class: ''},
                        last: {'number': getNumberOfPage(), class: ''},
                        hasPre: false,
                        hasPost: true
                    }
                }
                else if (currentPage() === getNumberOfPage() - 1 || currentPage() === getNumberOfPage() - 2) {
                    return {
                        first: {'number': 1, class: ''},
                        preCurrent: {'number': getNumberOfPage() - 3, class: ''},
                        current: {
                            'number': getNumberOfPage() - 2,
                            class: currentPage() === getNumberOfPage() - 2 ? 'current-page' : ""
                        },
                        postCurrent: {
                            'number': getNumberOfPage() - 1,
                            class: currentPage() === getNumberOfPage() - 1 ? 'current-page' : ""
                        },
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
            else {
                for (let i = 1; i <= getNumberOfPage(); i++) {
                    pages.push({'number': i, class: currentPage() === i ? 'current-page' : ''});
                }
                return pages;
            }
        },
        paginationMoreMode: function () {
            return paginationMoreMode();
        }
    });

    Template.history_in_profile.onRendered(function () {
        var instance = this;
        instance.autorun(function () {
            $('body').each(function () {
                // $(this).contents().wrapAll('<div id="wrapper">');
            });

        });
        $(document).ready(function () {
            if (currentPage() === 1) {
                $('#prevPage').css("pointer-events", "none");
                // console.log("currentpage=1");
            }
            if (currentPage() === getNumberOfPage()) {
                $('#nextPage').css("pointer-events", "none");
                // console.log("currentpage=n");
            }

        })
    });
    Template.history_in_profile.onCreated(function () {
        var template = this;

        template.autorun(function () {
            skipCount = (currentPage() - 1) * RECORD_PER_PAGE;
            template.subscribe('userActivityHistoryPagination', skipCount);
            //
            if (currentPage() === 1) {
                $('#prevPage').css("pointer-events", "none");
                // console.log("currentpage=1");
            }
            if (currentPage() === getNumberOfPage()) {
                $('#nextPage').css("pointer-events", "none");
                // console.log("currentpage=n");
            }

        });

    });
    var hasMorePages = function () {
        var currentPage = parseInt(FlowRouter.current().params.page) || 1;
        var jobCount = Counts.get('uahCount');
        // console.log("jobCount= " + jobCount);
        return currentPage * RECORD_PER_PAGE < jobCount;
    };
    var currentPage = function () {
        // console.log("params.page = "+ FlowRouter.current().params.page);
        return parseInt(FlowRouter.current().params.page) || 1;
    };
    var paginationMoreMode = function () {
        if (getNumberOfPage() > NUMBER_OF_VISIBLE_PAGE)
            return true;
        return false;
    };
    var getNumberOfPage = function () {
        let uahCount = Counts.get('uahCount');
        let numberOfPage = (uahCount / RECORD_PER_PAGE) > Math.floor(uahCount / RECORD_PER_PAGE)
            ? (Math.floor(uahCount / RECORD_PER_PAGE) + 1) : Math.floor(uahCount / RECORD_PER_PAGE);
        // console.log("numberOfPage= "+ numberOfPage);
        return numberOfPage;
    };
    Template.history_in_profile.events({
        "click .goPage": function () {
            BlazeLayout.reset();
        }
    })
}
