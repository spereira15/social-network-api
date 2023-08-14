const router = require('express').Router();
const {
  createReaction,
  removeReaction,
} = require('../../controllers/reactionControllers');

// /api/reactions/:thoughtId
router.route('/:thoughtId')
  .post(createReaction);

// /api/reactions/:thoughtId/:reactionId
router.route('/:thoughtId/:reactionId')
  .delete(removeReaction);

module.exports = router;
