const { User, Thought } = require('../models'); // Make sure to import the correct models

const thoughtControllers = {
  // GET all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .sort({ createdAt: -1 })
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => res.status(500).json(err));
  },

  // GET a single thought by _id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // POST a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thoughtData) => {
        // Add the thought id to the associated user's thoughts array
        return User.findOneAndUpdate(
          { username: req.body.username },
          { $push: { thoughts: thoughtData._id } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'No user found with this username!' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // PUT update a thought by _id
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // DELETE a thought by _id
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        // Remove the thought id from the associated user's thoughts array
        return User.findOneAndUpdate(
          { username: thoughtData.username },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
      .then(() => res.json({ message: 'Thought and associated reactions deleted successfully!' }))
      .catch((err) => res.status(400).json(err));
  },

  // POST add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // DELETE remove a reaction from a thought by reactionId
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = thoughtControllers;
