const Proposal = require('../models/Proposal');

const proposalController = {
  /**
   * Get all events
   */
  getAll: async (req, res) => {
    try {
      const {
        limit = 50,
        page = 1
      } = req.query;
      const proposals = await Proposal.find(
        {},
        null,
        {
          sort: { createdAt: -1 },
          limit: parseInt(limit),
          skip: (parseInt(page) - 1) * parseInt(limit)
        }
      );
      const total = await Proposal.countDocuments({});
      res.json({
        success: true,
        data: proposals,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error getting events:', error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get event by transaction hash and log index
   */
  getById: async (req, res) => {
    try {
      const { proposalId } = req.params;

      const proposal = await Proposal.findOne(
        { id: parseInt(proposalId)}
      );

      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found' });
      }

      res.json(proposal);
    } catch (error) {
      console.error('Error getting proposal:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = proposalController;
