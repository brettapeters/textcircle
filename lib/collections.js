import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { attachSchema } from 'meteor/aldeed:collection2';

export const Documents = new Mongo.Collection('documents');
export const EditingUsers = new Mongo.Collection('editingUsers');
export const Comments = new Mongo.Collection('comments');

Comments.attachSchema( new SimpleSchema({
  title: {
    type: String,
    label: 'Title',
    max: 200,
  },
  body: {
    type: String,
    label: 'Comment',
    max: 1000,
  },
  docid: {
    type: String,
  },
}));