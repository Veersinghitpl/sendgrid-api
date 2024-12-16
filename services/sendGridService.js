const sgClient = require('@sendgrid/client');
const dotenv = require('dotenv');

const axios = require('axios');

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Ensure your SendGrid API key is set


dotenv.config();

sgClient.setApiKey(process.env.SENDGRID_API_KEY);




async function sendTransactionalEmail(to, subject, textContent, htmlContent) {
    try {
      const msg = {
        to: to,
        from: 'satyamindapoint@gmail.com',  // Replace with your verified sender email in SendGrid
        subject: subject,
        text: textContent,
        html: htmlContent,
      };
  
      const response = await sgMail.send(msg);
      return response;
    } catch (error) {
      throw error.response?.body?.errors || error.message;
    }
  }





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
      return response.data.result; // Assuming the response contains a `result` array of senders
    } catch (error) {
      console.error('Error fetching senders:', error.response?.data || error.message);
      throw error.response?.data?.errors || error.message;
    }
  }
  
  


// Create a campaign
async function createCampaign(data) {
    try {

      const request = {
        method: 'POST',
        url: '/v3/marketing/campaigns',
        body: {
         name: data.title || data.name,
          subject: data.subject,
          sender_id:data.senderId,
          from: data.from,  // Add the "from" field
          status: data.status
        },
      };

      console.log(request,"request......")
     
      const [response] = await sgClient.request(request);
      return response.body;
    } catch (error) {
      console.log(error.response.body, "ERROR............");
      throw error.response?.body?.errors || error.message;
    }
  }
  

// Retrieve a campaign
async function getCampaign(campaignId) {
  try {
    const request = {
      method: 'GET',
      url: `/v3/marketing/campaigns/${campaignId}`,
    };
    const [response] = await sgClient.request(request);
    return response.body;
  } catch (error) {
    throw error.response?.body?.errors || error.message;
  }
}


// campaign-lis

async function getCampaignlist() {
    try {
      const request = {
        method: 'GET',
        url: `/v3/marketing/campaigns`,
      };
      const [response] = await sgClient.request(request);
      return response.body;
    } catch (error) {
      throw error.response?.body?.errors || error.message;
    }
  }


// Update a campaign
async function updateCampaign(campaignId, data) {
  try {
    const request = {
      method: 'PATCH',
      url: `/v3/marketing/campaigns/${campaignId}`,
      body: {
        name: data.title || data.name,
         subject: data.subject,
         sender_id: parseInt(data.sender_id),
         from: data.from,  // Add the "from" field
         status: data.status
       },
    };

    const [response] = await sgClient.request(request);
    return response.body;
  } catch (error) {

    console.log(error.response.body, "ERROR............");
      throw error.response?.body?.errors || error.message
  }
}

// Delete a campaign
async function deleteCampaign(campaignId) {
  try {
    const request = {
      method: 'DELETE',
      url: `/v3/marketing/campaigns/${campaignId}`,
    };
    const [response] = await sgClient.request(request);
    return response.body;
  } catch (error) {
    throw error.response?.body?.errors || error.message;
  }
}

module.exports = {
  createCampaign,
  getCampaign,
  getCampaignlist,
  updateCampaign,
  deleteCampaign,
  sendTransactionalEmail
};
