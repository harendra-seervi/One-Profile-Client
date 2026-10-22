import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';

const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://one-profile-server.vercel.app'
  : 'http://localhost:5000';

const DEFAULT_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const ENV_OPENAI_ENDPOINT = process.env.REACT_APP_OPENAI_ENDPOINT || DEFAULT_ENDPOINT;
const ENV_OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';

function getStoredUsername() {  
  const raw = localStorage.getItem('username');
  if (!raw) return '';

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'string') return parsed;
    if (parsed && typeof parsed === 'object') return parsed.username || parsed.opusername || '';
    return '';
  } catch (error) {
    return raw;
  }
}

function resolvePlatformRatings(profile) {
  return {
    codeforces: Number(profile?.codeforcesRating || 0),
    codechef: Number(profile?.codechefRating || 0),
    atcoder: Number(profile?.atcoderRating || 0),
    leetcode: Number(profile?.leetcodeRating || 0),
    composite: Number(profile?.compositeRating || 0),
  };
}

function formatRatingValue(value) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function buildMissingProfile() {
  return {
    name: 'Demo User',
    opusername: 'demo-user',
    country: 'India',
    codeforcesRating: 1500,
    codechefRating: 1400,
    atcoderRating: 950,
    leetcodeRating: 1700,
    compositeRating: 1560,
  };
}

function ProblemRecommendation() {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [targetPlatform, setTargetPlatform] = useState('Codeforces');
  const [targetRating, setTargetRating] = useState(1700);
  const [topicsInput, setTopicsInput] = useState('Greedy, DP, Graphs, Binary Search');
  const [focusArea, setFocusArea] = useState('Improve contest consistency and solve medium/hard problems');
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoadingProfile(true);
      const username = getStoredUsername();

      if (!username) {
        setProfile(buildMissingProfile());
        return;
      }

      const response = await fetch(`${API_BASE}/api/profile/${encodeURIComponent(username)}`, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        setProfile(buildMissingProfile());
        return;
      }

      const json = await response.json();
      if (!json?.success || !json?.data) {
        setProfile(buildMissingProfile());
        return;
      }

      setProfile(json.data);
    } catch (err) {
      console.error('Failed to load profile for recommendation module:', err);
      setProfile(buildMissingProfile());
    } finally {
      setLoadingProfile(false);
    }
  }

  const platformRatings = useMemo(() => resolvePlatformRatings(profile), [profile]);

  async function generateRecommendation() {
    setLoadingRecommendation(true);
    setError('');
    setRecommendation('');

    if (!ENV_OPENAI_API_KEY.trim()) {
      setError('OpenAI API key is not configured in the environment. Please add REACT_APP_OPENAI_API_KEY to the project .env file.');
      setLoadingRecommendation(false);
      return;
    }

    if (!ENV_OPENAI_ENDPOINT.trim()) {
      setError('OpenAI endpoint is not configured in the environment. Please add REACT_APP_OPENAI_ENDPOINT to the project .env file.');
      setLoadingRecommendation(false);
      return;
    }

    try {
      const payload = {
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: 'You are a competitive programming coach. Give a concise but useful structured analysis in plain English. Return sections like: Recommended Focus, Problem Types, Weekly Plan, Platform Strategy, and Weaknesses. Keep the advice actionable and realistic.',
          },
          {
            role: 'user',
            content: `User profile data:
${JSON.stringify({
  username: profile?.opusername || 'demo-user',
  ratings: platformRatings,
  targetPlatform,
  targetRating,
  focusArea,
  preferredTopics: topicsInput,
}, null, 2)}

Based on this user profile and their current ratings across platforms, suggest what types of problems, topics, and practice routines they should focus on to improve across the relevant platforms. Recommend a realistic 2-4 week plan, with detailed weekly actions and problem types. Make the advice personal to their current strengths and weakness.`
          },
        ],
      };

      const response = await fetch(ENV_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ENV_OPENAI_API_KEY.trim()}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.error?.message || 'The AI request failed. Please verify the configured environment values.');
      }

      const aiText = json?.choices?.[0]?.message?.content || 'No recommendation generated.';
      setRecommendation(aiText.trim());
    } catch (err) {
      console.error('Recommendation generation failed:', err);
      setError(err.message || 'Unable to generate recommendation right now.');
    } finally {
      setLoadingRecommendation(false);
    }
  }

  if (loadingProfile) {
    return (
      <div className="rating-dashboard">
        <div className="rating-content-wrapper" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 18px 40px' }}>
          <Paper sx={{ p: 4, background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, color: '#e2e8f0' }}>
              <CircularProgress size={20} sx={{ color: '#fbbf24' }} />
              Loading profile ratings...
            </Box>
          </Paper>
        </div>
      </div>
    );
  }

  const ratingsList = [
    { label: 'Codeforces', value: formatRatingValue(platformRatings.codeforces) },
    { label: 'CodeChef', value: formatRatingValue(platformRatings.codechef) },
    { label: 'AtCoder', value: formatRatingValue(platformRatings.atcoder) },
    { label: 'LeetCode', value: formatRatingValue(platformRatings.leetcode) },
    { label: 'Composite', value: formatRatingValue(platformRatings.composite) },
  ];

  return (
    <div className="rating-dashboard">
      <div className="rating-content-wrapper" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 18px 40px' }}>
        <div className="rating-header-row" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          padding: '18px 20px',
          borderRadius: 20,
          background: 'linear-gradient(90deg, rgba(16, 24, 40, 0.94), rgba(8, 17, 29, 0.94))',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
          marginBottom: 18,
          flexWrap: 'wrap',
        }}>
          <div className="rating-title-wrap">
            <span className="section-kicker">AI Coach</span>
            <h1 className="rating-heading" style={{ margin: 0 }}>Problem Recommendation</h1>
          </div>
        </div>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2, mb: 3 }}>
          {ratingsList.map((item) => (
            <Paper key={item.label} sx={{ p: 2.5, background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: 3 }}>
              <Typography sx={{ color: '#cbd5e1', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</Typography>
              <Typography sx={{ color: '#fbbf24', fontSize: 28, fontWeight: 800 }}>{item.value}</Typography>
            </Paper>
          ))}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1.1fr 1.5fr', gap: 3 }}>
          <Paper sx={{ p: 3, background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: 3, height: 'fit-content' }}>
            <Typography sx={{ color: '#fbbf24', fontWeight: 800, fontSize: 24, mb: 2 }}>Goal Settings</Typography>

            <Box sx={{ display: 'grid', gap: 2 }}>
              <Select
                value={targetPlatform}
                onChange={(event) => setTargetPlatform(event.target.value)}
                size="small"
                sx={{
                  color: '#f8fafc',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  '& .MuiSelect-select': { color: '#f8fafc' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.35)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fbbf24' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fbbf24' },
                  '& .MuiSvgIcon-root': { color: '#fbbf24' },
                }}
              >
                {['Codeforces', 'CodeChef', 'AtCoder', 'LeetCode'].map((platform) => (
                  <MenuItem key={platform} value={platform} sx={{ color: '#f8fafc', backgroundColor: '#0f172a', '&:hover': { backgroundColor: 'rgba(251, 191, 36, 0.12)' } }}>{platform}</MenuItem>
                ))}
              </Select>

              <TextField
                label="Target rating"
                type="number"
                variant="outlined"
                size="small"
                value={targetRating}
                onChange={(event) => setTargetRating(Number(event.target.value || 0))}
                InputLabelProps={{ style: { color: '#cbd5e1' } }}
                InputProps={{ style: { color: '#f8fafc' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#f8fafc',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.35)' },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fbbf24' },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fbbf24' },
                  '& .MuiInputBase-input': { color: '#f8fafc' },
                  '& .MuiInputLabel-root': { color: '#cbd5e1' },
                }}
              />

              <TextField
                label="Topics to master"
                variant="outlined"
                size="small"
                value={topicsInput}
                onChange={(event) => setTopicsInput(event.target.value)}
                InputLabelProps={{ style: { color: '#cbd5e1' } }}
                InputProps={{ style: { color: '#f8fafc' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#f8fafc',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.35)' },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fbbf24' },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fbbf24' },
                  '& .MuiInputBase-input': { color: '#f8fafc' },
                  '& .MuiInputLabel-root': { color: '#cbd5e1' },
                }}
              />

              <TextField
                label="Focus area / improvement goal"
                variant="outlined"
                multiline
                minRows={4}
                value={focusArea}
                onChange={(event) => setFocusArea(event.target.value)}
                InputLabelProps={{ style: { color: '#cbd5e1' } }}
                InputProps={{ style: { color: '#f8fafc' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#f8fafc',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.35)' },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fbbf24' },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fbbf24' },
                  '& .MuiInputBase-input': { color: '#f8fafc' },
                  '& .MuiInputLabel-root': { color: '#cbd5e1' },
                }}
              />

              <Button
                variant="contained"
                onClick={generateRecommendation}
                disabled={loadingRecommendation}
                sx={{
                  background: '#fbbf24',
                  color: '#111827',
                  fontWeight: 800,
                  borderRadius: 2,
                  '&:hover': { background: '#facc15' },
                }}
              >
                {loadingRecommendation ? 'Generating...' : 'Generate Recommendation'}
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: 3 }}>
            <Typography sx={{ color: '#fbbf24', fontWeight: 800, fontSize: 24, mb: 2 }}>AI Analysis</Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
            )}

            {!loadingRecommendation && !recommendation && !error && (
              <Typography sx={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                AI recommendations are configured from the environment and will be generated using your saved platform ratings.
              </Typography>
            )}

            {loadingRecommendation && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, py: 4, color: '#e2e8f0' }}>
                <CircularProgress size={20} sx={{ color: '#fbbf24' }} />
                Building your personalized study plan...
              </Box>
            )}

            {!loadingRecommendation && recommendation && (
              <Typography sx={{ color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {recommendation}
              </Typography>
            )}
          </Paper>
        </Box>
      </div>
    </div>
  );
}

export default ProblemRecommendation;
