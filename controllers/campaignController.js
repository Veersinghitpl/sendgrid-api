const {
  createCampaign,
  getCampaign,
  getCampaignlist,
  updateCampaign,
  deleteCampaign,
  sendTransactionalEmail
} = require('../services/sendGridService');

const dotenv = require('dotenv');

const axios = require('axios');

dotenv.config();



const axiosInstance = axios.create({
    baseURL: process.env.SENDGRID_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });


  async function getSenders() {
    try {
      const response = await axiosInstance.get('/marketing/senders');

      console.log(response.data,"sender-list.....")
      return response.data;
      
    } catch (error) {
      console.error('Error fetching senders:', error.response?.data || error.message);
      throw error.response?.data?.errors || error.message;
    }
  }


// POST /campaigns
async function createCampaignHandler(req, res) {
  try {

    const senders = await getSenders();

    console.log(senders[0].id,"sender Id........");

    if (!senders || senders.length === 0) {
      throw new Error('No senders found. Please create a sender profile in SendGrid.');
    }

    const senderId = senders[0].id;


    const { name, subject, status,from } = req.body;

    // Basic validation for required fields
    
    const campaignData = {
      name,
      subject,
      senderId,
      from,
      status,
    };

    console.log(campaignData,"this is campaign data controller..........")


    const response = await createCampaign(campaignData);
    res.status(201).json({ message: 'Campaign created successfully', data: response });
  } catch (error) {
    res.status(400).json({ error: Array.isArray(error) ? error : [error] });
  }
}

// GET /campaigns/:campaignId
async function getCampaignHandler(req, res) {
  try {
    const response = await getCampaign(req.params.campaignId);
    res.status(200).json({message: 'Campaign fetched successfully',data:response});
  } catch (error) {
    res.status(404).json({ error });
  }
}



// get-all campaign-list


async function getCampaignHandlerlist(req, res) {
  try {
    const response = await getCampaignlist();
    res.status(200).json({message: 'Campaign fetched successfully',data:response});
  } catch (error) {
    res.status(404).json({ error });
  }
}

// PUT /campaigns/:campaignId
async function updateCampaignHandler(req, res) {
  try {
    
    const { name, subject, sender_id, status,from } = req.body;
    const campaignData = {
      name,
      subject,
      sender_id,
      from,
      status,
    }; 

    const response = await updateCampaign(req.params.campaignId, campaignData);
    res.status(200).json({ message: 'Campaign updated successfully', data: response });
  } catch (error) {
    res.status(400).json({ error });
  }
}

// DELETE /campaigns/:campaignId
async function deleteCampaignHandler(req, res) {
  try {
    const response=await deleteCampaign(req.params.campaignId);
    res.status(200).json({ message: 'Campaign deleted successfully',data:response });
  } catch (error) {
    res.status(400).json({ error });
  }
}






// POST /transactional-email
async function sendTransactionalEmailHandler(req, res) {
  try {
    const { to, subject, textContent, htmlContent } = req.body;

    // Basic validation for required fields
    if (!to || !subject || !textContent || !htmlContent) {
      return res.status(400).json({ error: 'Missing required fields in the request body.' });
    }

    const response = await sendTransactionalEmail(to, subject, textContent, htmlContent);
    res.status(200).json({ message: 'Transactional email sent successfully', data: response });
  } catch (error) {
    res.status(400).json({ error: Array.isArray(error) ? error : [error] });
  }
}





module.exports = {
  createCampaignHandler,
  getCampaignHandler,
  getCampaignHandlerlist,
  updateCampaignHandler,
  deleteCampaignHandler,

  sendTransactionalEmailHandler
};
