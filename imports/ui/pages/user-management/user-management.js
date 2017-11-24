import "./user-management.html"
import '../../../startup/both/userCollection';
import {Prov} from "../../../startup/both/province";
import {messageLogError} from "../../../partials/messages-error";
import {messageLogSuccess} from "../../../partials/messages-success";
// import "../common-template/pagination.html";
import {paginationDataGeneration} from "../../../helpers/paginationDataGeneration";
if (Meteor.isClient){
    Session.setDefault("currentUserProfile", "");
    const RECORD_PER_PAGE = 10;
    const NUMBER_OF_VISIBLE_PAGE = 5;
    const PATH_JOB_PAGE = '/user-management/page/';
    var skipCount=1;
    Template.userManagement.helpers({
        listUser: function () {
            //get list user
            var listUser = Meteor.users.find({}, {fields: {_id : 1, username: 1, emails: 1}, sort:{
                createdAt: -1
            }}).fetch();
            //get first user profile in list
            var currentUserProfile = Meteor.users.findOne({_id: listUser[0]._id});
            Session.set("currentUserProfile", currentUserProfile);
            return listUser;
        },
        isCurrentUser: function (_id) {
            console.log("Session.get(currentUserProfile)._id = "+ Session.get("currentUserProfile")._id);
            console.log("_id= "+ _id);
            return  Session.get("currentUserProfile")._id === _id;
        }
    })
    Template.userManagement.events({
        'click .item-user': function () {
            var currentUserProfile = Meteor.users.findOne({_id: this._id});
            Session.set("currentUserProfile", currentUserProfile);
        }
    })
    Template.userManagement.onCreated(function () {
        var template = this;
        template.autorun(function () {
            skipCount = (currentPage() - 1) * RECORD_PER_PAGE;
            template.subscribe('listUser', skipCount);
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
    })
    Template.userManagement.onRendered(function () {
        $(document).ready(function () {
            if (currentPage() === 1) {
                $('#prevPage').css("pointer-events", "none");
            }
            if (currentPage() === getNumberOfPage()) {
                $('#nextPage').css("pointer-events", "none");
            }
        })
    })
    //////////////////////////////////////////////
    Session.setDefault("indexDis", 0);
    Template.profileAddressInUserManagement.helpers({
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
    Template.profileAddressInUserManagement.events({
        "change #provinceAddress": function (evt) {
            var provinceId = $(evt.target).val();
            Session.set("indexDis", provinceId);
        }
    });

    //////////////////////////////////////////////
    Template.userProfileInUserManagement.helpers({
        currentUser: function () {
            return Session.get("currentUserProfile");
        }
    })
    Template.userProfileInUserManagement.onCreated(function () {

    })
    Template.userProfileInUserManagement.events({
        'submit form': function (event) {
            event.preventDefault();
            var nameUpdate = event.target.nameProfile.value;
            var phoneUpdate = event.target.phoneProfile.value;
            // var addressUpdate = event.target.addressProfile.value;
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
            updateProfile.info = infoUpdate;

            updateProfile.province = provinceAddress;
            updateProfile.district = disAddress;
            updateProfile.home_address = homeAddressUpdate;
            updateProfile.avatar = avtimage;
            console.log("current profile._id= "+ Session.get("currentUserProfile")._id);

            Meteor.call("Meteor.users.updateUserInfo", Session.get("currentUserProfile")._id, updateProfile, function (err, result) {
                if (result === "error"){
                   messageLogError("Thao tác bị lỗi");
                    // console.log("result === error");
                }else{
                    messageLogSuccess("Cập nhật thông tin người dùng thành công!");
                }
            });

        },
        "click #delete_user": function (e) {
            e.stopPropagation();
            e.preventDefault();
            new Confirmation(
                {
                    message: "Bạn có thực sự muốn xóa người dùng này?",
                    title: "Giúp Việc Đây",
                    cancelText: "Huỷ",
                    okText: "Đồng ý",
                    success: true, // whether the button should be green or red
                    focus: "none" // which button to autofocus, "cancel" (default) or "ok", or "none"
                }, function (ok) {
                    // ok is true if the user clicked on "ok", false otherwise
                    // console.log(ok);
                    if (ok) {
                        Meteor.call("Meteor.users.deleteUser", Session.get("currentUserProfile")._id, function (err, result) {
                            if (result === "error") {
                                messageLogError("Thao tác bị lỗi");
                                // console.log("result === error");
                            } else {
                                messageLogSuccess("Xóa người dùng thành công!");
                            }
                        });

                    }
                })
        },
        "click #ban_user": function (e) {
            e.stopPropagation();
            e.preventDefault();
            var reason = prompt("Hãy nhập thêm thông tin về lỗi của người dùng:", "");
            if (reason == null || reason == "") {
                alert("Bạn cần nhập thông tin này");
                return;
            }
            Meteor.call("Meteor.users.banUser", Session.get("currentUserProfile")._id, reason, function (err, result) {
                if (result === "error"){
                    messageLogError("Thao tác bị lỗi");
                }else{
                    messageLogSuccess("Cấm người dùng thành công!");
                }
            });
        },
        "click #unban_user": function (e) {
            e.stopPropagation();
            e.preventDefault();
            new Confirmation(
                {
                    message: "Xác nhận bỏ cấm người dùng",
                    title: "Giúp Việc Đây",
                    cancelText: "Huỷ",
                    okText: "Đồng ý",
                    success: true, // whether the button should be green or red
                    focus: "none" // which button to autofocus, "cancel" (default) or "ok", or "none"
                }, function (ok) {
                    // ok is true if the user clicked on "ok", false otherwise
                    // console.log(ok);
                    if (ok) {
                        Meteor.call("Meteor.users.unbanUser", Session.get("currentUserProfile")._id, function (err, result) {
                            if (result === "error"){
                                messageLogError("Thao tác bị lỗi");
                            }else{
                                messageLogSuccess("Bỏ cấm người dùng thành công!");
                            }
                        });
                    }
                })
        }
    })
    ///////////////////////
    Template.paginationInUserManagement.events({
        "click .goPage": function () {
            BlazeLayout.reset();
        }
    })
    Template.paginationInUserManagement.helpers({
        prevPage: function () {
            var previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
            return PATH_JOB_PAGE + previousPage;
        },
        nextPage: function () {
            var nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
            return PATH_JOB_PAGE + nextPage;
        },
        pageNumbers: function () {
            return paginationDataGeneration(paginationMoreMode(), currentPage(), getNumberOfPage());
        },
        link: function () {
            return PATH_JOB_PAGE;
        },
        paginationMoreMode: function () {
            return paginationMoreMode();
        }
    })
    var hasMorePages = function () {
        var currentPage = parseInt(FlowRouter.current().params.page) || 1;
        var userCount = Counts.get('userCount');
        console.log("userCount= " + userCount);
        return currentPage * RECORD_PER_PAGE < userCount;
    };
    var currentPage = function () {
        return parseInt(FlowRouter.current().params.page) || 1;
    };
    var paginationMoreMode = function () {
        if (getNumberOfPage() > NUMBER_OF_VISIBLE_PAGE)
            return true;
        return false;
    };
    var getNumberOfPage = function () {
        let userCount = Counts.get('userCount');
        let numberOfPage = (userCount / RECORD_PER_PAGE) > Math.floor(userCount / RECORD_PER_PAGE)
            ? (Math.floor(userCount / RECORD_PER_PAGE) + 1) : Math.floor(userCount / RECORD_PER_PAGE);
        return numberOfPage;
    }
}
