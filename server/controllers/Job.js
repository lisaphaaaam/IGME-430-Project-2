
const models = require('../models');

const { Job, Account } = models;

const makerPage = (req, res) => {
  return res.render('app');
};

const makeJob = async (req, res) => {
  if (!req.body.title || !req.body.company || !req.body.pay) {
    return res.status(400).json({ error: 'title, company, and pay are required!' });
  }

  const jobData = {
    title: req.body.title,
    company: req.body.company,
    pay: req.body.pay,
    type: req.body.type,
    applied: req.body.applied,
    status: req.body.status,
    owner: req.session.account._id,
  };


  try {
    const newJob = new Job(jobData);
    await newJob.save();

    // const account = await Account.findById(req.session.account._id);
    // account.count += 1;
    // const result = await account.save();
    // console.log('Updated Account:', result);   

    return res.status(201).json({ title: newJob.title, company: newJob.company, pay: newJob.pay });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Job already exists! ' });
    }
    return res.status(500).json({ error: 'An error occured making job application!' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const id = req.body.id;
    await Job.deleteOne({ _id: id, owner: req.session.account._id });

    // const account = await Account.findById(req.session.account._id);
    // account.count -= 1;
    // const result = await account.save();
    // console.log('Updated Account after deletion:', result);    

    return res.status(200).json({ message: 'Deleted!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to delete job application' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const updated = await Job.findOneAndUpdate(
      { _id: id, owner: req.session.account._id },
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    return res.status(200).json({ message: 'Status updated!', updatedStatus: updated.status });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to update status' });
  }
};

const updateNotes = async (req, res) => {
  try {
    const { id, notes } = req.body;

    const updated = await Job.findOneAndUpdate(
      { _id: id, owner: req.session.account._id },
      { notes },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update notes.' });
  }
};

const getJobs = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Job.find(query).select('title company pay type applied status notes').lean().exec();

    return res.json({ jobs: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving job apps!' });
  }
};

module.exports = {
  makerPage,
  makeJob,
  deleteJob,
  updateStatus,
  updateNotes,
  getJobs,
};
