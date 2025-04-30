/* the job application information */

const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  pay: {
    type: Number,
    min: 0,
    required: true,
  },
  type: {
    type: String,
    enum: ["full-time", "part-time", "internship", "volunteer"],
  },
  applied: {
    type: String,
    enum: ["yes", "no"],
  },
  status: {
    type: String,
    enum: ["waiting", "rejected", "interview", "offer", "accepted"],
  },
  notes: {
    type: String,
    default: '',
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

JobSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  company: doc.company,
  pay: doc.pay,
  type: doc.type,
  applied: doc.applied,
  status: doc.status,
});


const JobModel = mongoose.model('Job', JobSchema);
module.exports = JobModel;
