import {
	$
}
from 'meteor/jquery';
import {
	Documents,
	EditingUsers,
	Comments
}
from '../../lib/collections.js';

window.Comments = Comments;

/*SUBSCRIPTIONS*/
Meteor.subscribe('documents');
Meteor.subscribe('editingUsers');
Meteor.subscribe('comments');

/*HELPERS*/
Template.editor.helpers({
	docid: function() {
		setupCurrentDocument();
		return Session.get('docid');
	},
	config: function() {
		return function(editor) {
			editor.setOption('lineNumbers', true);
			editor.setOption('theme', 'monokai');
			editor.setOption('mode', 'html');
			editor.on('change', function(cm_editor, info) {
				let editor_contents = cm_editor.getValue();
				$('#viewer_iframe').contents().find('html').html(editor_contents);
				Meteor.call('addEditingUser', Session.get('docid'));
			});
		}
	},
});

Template.editingUsers.helpers({
	users: function() {
		let doc, eUsers, users, i;
		doc = Documents.findOne(Session.get('docid'));
		if (!doc) {
			return
		};
		eUsers = EditingUsers.findOne({
			docid: doc._id
		})
		if (!eUsers) {
			return
		};
		users = [];
		i = 0;
		for (let user_id in eUsers.users) {
			users[i] = fixObjectKeys(eUsers.users[user_id]);
			i++;
		}
		return users;
	},
});

Template.navbar.helpers({
	documents: function() {
		return Documents.find();
	},
});

Template.docMeta.helpers({
	document: function() {
		return Documents.findOne({
			_id: Session.get('docid')
		});
	},
	canEdit: function() {
		return !!Documents.findOne({
			_id: Session.get('docid'),
			owner: Meteor.userId()
		});
	},
});

Template.editableText.helpers({
	userCanEdit: function() {
		return !!Documents.findOne({
			_id: Session.get('docid'),
			owner: Meteor.userId()
		});
	}
});

Template.docList.helpers({
	documents: function() {
		return Documents.find();
	},
});

Template.insertCommentForm.helpers({
	docid: function() {
		return Session.get('docid');
	},
});

Template.commentList.helpers({
	comments: function() {
		return Comments.find({ docid: Session.get('docid') });
	}
});

function fixObjectKeys(obj) {
	let newObj = {};
	for (let key in obj) {
		let key2 = key.replace('-', '');
		newObj[key2] = obj[key];
	}
	return newObj;
}

function setupCurrentDocument() {
	var doc;
	if (!Session.get('docid')) {
		doc = Documents.findOne();
		if (doc) {
			Session.set('docid', doc._id);
		}
	}
}

/*EVENTS*/
Template.navbar.events({
	'click .js-add-doc': function(event) {
		event.preventDefault();
		if (!Meteor.user()) {
			alert('You need to login first.');
		}
		else {
			Meteor.call('addDoc', function(err, res) {
				if (!err) {
					Session.set('docid', res);
				}
			});
		}
	},
});

Template.docMeta.events({
	'click .js-toggle-private': function(event) {
		var isPrivate = event.target.checked;
		var doc = {
			_id: Session.get('docid'),
			isPrivate
		};
		Meteor.call('updateDocPrivate', doc);
	}
});
