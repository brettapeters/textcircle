import { Documents, EditingUsers, Comments } from '../lib/collections.js';

Meteor.startup(function(){
	// code to run on server at startup
	if (!Documents.findOne()) {
		Documents.insert({ title: "My new document" });
	}
});

/*PUBLICATIONS*/
Meteor.publish('documents', function() {
	return Documents.find({ $or: [{ owner: this.userId }, { isPrivate: { $ne: true } }] });
});

Meteor.publish('editingUsers', function() {
	return EditingUsers.find({});
});

Meteor.publish('comments', function() {
	return Comments.find({});
});