// zoom.js
const axios = require('axios');
require('dotenv').config();

const ZOOM_OAUTH_URL = 'https://zoom.us/oauth/token';
const ZOOM_API_URL = 'https://api.zoom.us/v2';

let accessToken = null;

async function getAccessToken() {
  const auth = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
  const url = `${ZOOM_OAUTH_URL}?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`;

  const res = await axios.post(url, null, {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  });

  accessToken = res.data.access_token;
  return accessToken;
}

async function createMeeting(meetingData) {
  if (!accessToken) await getAccessToken();

  const res = await axios.post(
    `${ZOOM_API_URL}/users/${process.env.ZOOM_USER_ID}/meetings`,
    {
      topic: meetingData.topic || 'Tutoring Session',
      type: 2,
      start_time: meetingData.start_time,
      duration: meetingData.duration || 60,
      timezone: 'UTC',
      settings: {
        join_before_host: false,
        approval_type: 1,
        waiting_room: true,
        meeting_authentication: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return res.data; // contains start_url, join_url, id, etc.
}


async function getMeetingPolls(meetingId) {
  const token = await getAccessToken();

  const res = await axios.get(
    `${ZOOM_API_URL}/report/meetings/${meetingId}/polls`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}

async function getAllUserMeetings() {
  const token = await getAccessToken();
  const userId = process.env.ZOOM_USER_ID;

  const headers = {
    Authorization: `Bearer ${token}`
  };

  // Fetch upcoming (scheduled) meetings
  const upcomingRes = await axios.get(
    `${ZOOM_API_URL}/users/${userId}/meetings?type=upcoming`,
    { headers }
  );

  // Fetch past meetings
  const pastRes = await axios.get(
    `${ZOOM_API_URL}/users/${userId}/meetings?type=past`,
    { headers }
  );

  return {
    upcoming_meetings: upcomingRes.data.meetings || [],
    past_meetings: pastRes.data.meetings || []
  };
}

module.exports = {
  createMeeting,
  getMeetingPolls,
  getAllUserMeetings
};
