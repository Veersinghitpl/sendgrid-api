const express = require('express');
const {
  createCampaignHandler,
  getCampaignHandler,
  getCampaignHandlerlist,
  updateCampaignHandler,
  deleteCampaignHandler,
  sendTransactionalEmailHandler
} = require('../controllers/campaignController');

const router = express.Router();

router.post('/transactional-email', sendTransactionalEmailHandler);


router.post('/campaigns', createCampaignHandler);
router.get('/campaigns', getCampaignHandlerlist);

router.get('/campaigns/:campaignId', getCampaignHandler);
router.patch('/campaigns/:campaignId', updateCampaignHandler);
router.delete('/campaigns/:campaignId', deleteCampaignHandler);



module.exports = router;
