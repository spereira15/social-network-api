const { User, Thought, Reaction } = require('../models');

const reactionControllers = {
  // POST create a reaction for a thought
  createReaction(req, res) {
    Reaction.create(req.body)
      .then((reactionData) => {
        // Add the reaction to the associated thought's reactions array
        return Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $push: { reactions: reactionData } },
          { new: true, runValidators: true }
        );
      })
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
    Reaction.findOneAndDelete({ reactionId: req.params.reactionId })
      .then((reactionData) => {
        if (!reactionData) {
          return res.status(404).json({ message: 'No reaction found with this id!' });
        }
        // Remove the reaction from the associated thought's reactions array
        return Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { new: true }
        );
      })
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = reactionControllers;
