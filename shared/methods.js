import { check } from 'meteor/check';
import { Documents, EditingUsers, Comments } from '../lib/collections.js';

Meteor.methods({
	addComment: function(comment) {
		console.log('inside addComment');
		check(comment, Object);
		if (this.userId) {
			comment.createdOn = new Date();
			comment.userId = this.userId;
			return Comments.insert(comment);
		}
	},
	addEditingUser: function(docid) {
		let doc, user, eUsers;
		doc = Documents.findOne(docid);
		if (!doc || !this.userId) { return; }
		user = Meteor.user().profile;
		eUsers = EditingUsers.findOne({ docid: doc._id })
		if (!eUsers) {
			eUsers = {
				docid: doc._id,
				users: {},
			};
		}
		user.lastEdit = new Date();
		eUsers.users[this.userId] = user;
		
		EditingUsers.upsert({ _id: eUsers._id }, eUsers);
	},
	
	addDoc: function() {
		if (!this.userId) {
			throw new Meteor.Error('Must be logged in');
		}
		const doc = { owner: this.userId,
								createdOn: new Date(),
								title: 'New Document',
								isPrivate: false,
		}
		return Documents.insert(doc);
	},
	
	updateDocPrivate: function(doc) {
		var realDoc = Documents.findOne({ _id: doc._id, owner: this.userId });
		if (realDoc) {
			realDoc.isPrivate = doc.isPrivate;
			Documents.update({ _id: doc._id }, realDoc);
		}
	}
});