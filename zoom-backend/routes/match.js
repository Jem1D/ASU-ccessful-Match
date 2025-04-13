// server/routes/matchTutors.js
const express = require('express');
const axios = require('axios');
const cosine = require('cosine-similarity');

const router = express.Router();

const HF_API_TOKEN = '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'; // Replace this with your actual Hugging Face token

// Get embedding from Hugging Face
async function getEmbedding(text) {
  const url = 'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2';
  const response = await axios.post(url, text, {
    headers: {
      Authorization: `Bearer ${HF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data; // Return the first embedding
}

// POST /api/match-tutors
router.post('/match-tutors', async (req, res) => {
  try {
    const { student, tutors } = req.body;

    const studentText = `Description: ${student.description}. Profile: ${student.profile}. Skills: ${student.skills.join(', ')}`;
    const studentVec = await getEmbedding(studentText);

    const scoredTutors = await Promise.all(
      tutors.map(async (tutor) => {
        const tutorText = `Description: ${tutor.description}. Profile: ${tutor.profile}. Skills: ${tutor.skills.join(', ')}`;
        const tutorVec = await getEmbedding(tutorText);
        const score = cosine(studentVec, tutorVec);
        console.log(studentVec);
        console.log(tutorVec);
        console.log(score);
        return { ...tutor, score };
      })
    );

    const topTutors = scoredTutors.sort((a, b) => b.score - a.score).slice(0, 3);
    res.json({ topTutors });
  } catch (err) {
    console.error('Matching error:', err);
    res.status(500).json({ error: 'Internal Server Error during matching' });
  }
});

module.exports = router;