import "./notifications.html";
import {Meteor} from 'meteor/meteor';
import {formatDate} from "../../../../imports/helpers/formatdate.js";
import {FlowRouter} from 'meteor/kadira:flow-router';
import { Notifications } from "../../../../imports/startup/both/userNotifications.js";
import {BlazeLayout} from 'meteor/kadira:blaze-layout';
const record_per_page = 10;

Template.notifications.helpers({
	notifications: function() {
		return Notifications.find(
			{ userId: Meteor.userId(), read: false },
			{ sort: { dateCreated: -1 } }
		);
	},
	notificationCount: function() {
		return Notifications.find({
			userId: Meteor.userId(),
			read: false
		}).count();
	}
});

Template.notificationItem.helpers({
	notificationPostPath: function() {
		console.log(this.jobPath);
		console.log(this.jobId);
		// console.log(FlowRouter.path({}));
		// return FlowRouter.path({_id:this.jobPath});
	}
});

Template.notificationItem.events({
	"click a": function() {
		// FlowRouter.go('/job/' + this.jobPath + '/' + this.jobId);
		Notifications.update(this._id, { $set: { read: true } });
        BlazeLayout.reset();
	}
});

if (Meteor.isClient) {
	var skipCount = 1;

	Template.shownoti.onCreated(function () {
		var template = this;
		template.autorun(function () {
            var currentPage = parseInt(FlowRouter.current().params.page) || 1;
            skipCount = (currentPage - 1) * record_per_page;
            template.subscribe('notPage',skipCount,Meteor.user()._id);
        });

            if (currentPage() === 1) {
                $('#prevPage').hide();
                console.log('onCreated currentpage =' + 1);
            }
            console.log('currentpage =' + currentPage());

			if (currentPage() === getNumberOfPage() ) {
				$('#nextPage').hide();
                console.log('onCreated currentpage = n');
			}
			console.log("number of pages:"+ getNumberOfPage());

    });

    Template.shownoti.helpers({
        'notify': function () {
            let data = Notifications.find({userId: Meteor.user()._id},{sort:{dateCreated:-1}}).fetch();
            data.forEach(function (element) {
				element.dateCreated = formatDate(element.dateCreated);
            });
			return data;
        },

        prevPage: function () {
            var previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
            return "/notification/page/" + previousPage
        },

		nextPage: function () {
            var nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
            return "/notification/page/" + nextPage
        }

        // isRead : function (r) {
			// // let status = Notifications.find({userID: Meteor.user()._id});
			// return r;
        // }
    });
    
    Template.shownoti.events({
        "click .goPage": function () {
            BlazeLayout.reset();
        },
		"click a": function () {
            Notifications.update(this._id, { $set: { read: true } });
        },
		"change .checkSingle": function () {
            Notifications.update(this._id, { $set: { read: true } });
        },
		"click #checkedAll": function () {
			Meteor.call('notifications.markAll');
        }
	});


    Template.shownoti.onRendered(function(){
        var instance = this;
        instance.autorun(function () {
            $('body').each(function () {
            });
        });
		$(document).ready( function () {

			// event.preventDefault();
			$("#checkedAll").change(function(){
    			if(this.checked){
     	 			$(".checkSingle").each(function(){
        				this.checked=true;
      				})              
    			}else{
      				$(".checkSingle").each(function(){
        				this.checked=false;
      				})              
    			}
        	});

        	$(".checkSingle").click(function () {
			    if ($(this).is(":checked")){
			      var isAllChecked = 0;
			      $(".checkSingle").each(function(){
			        if(!this.checked)
			           isAllChecked = 1;
			      	})              
			      if(isAllChecked == 0){ $("#checkedAll").prop("checked", true); }     
			    }
			    else {
			      $("#checkedAll").prop("checked", false);
			    	}
			  });

            if (currentPage() === 1) {
                $('#prevPage').hide();
                console.log('onRendered currentpage =' + 1);
            }
            console.log('currentpage =' + currentPage());

            if (currentPage() === getNumberOfPage()  ) {
                $('#nextPage').hide();
                console.log('onRendered currentpage =n' );
            }
            console.log("number of pages:"+ getNumberOfPage());
		})
	});
    var hasMorePages = function () {
        var currentPage = parseInt(FlowRouter.current().params.page) || 1;
        var notiCount = Counts.get('notCount');
        console.log("notCount= " + notiCount);
        return currentPage * record_per_page < notiCount;
    }

    var currentPage = function () {
        return parseInt(FlowRouter.current().params.page) || 1;
    }

    var getNumberOfPage = function () {
        let notCount = Counts.get('notCount');
        let numberOfPage = (notCount / record_per_page) > Math.floor(notCount / record_per_page)
            ? (Math.floor(notCount / record_per_page) + 1) : Math.floor(notCount / record_per_page);
        // console.log("numberOfPage= "+ numberOfPage);
        return numberOfPage;
    }

}