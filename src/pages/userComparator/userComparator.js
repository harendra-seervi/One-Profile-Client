import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://one-profile-server.vercel.app'
  : 'http://localhost:5000';

function normalizeUsername(value) {
  return String(value || '').trim().toLowerCase();
}

function getStoredUsername() {
  const raw = localStorage.getItem('username');
  if (!raw) return '';

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'string') return parsed;
    if (parsed && typeof parsed === 'object') return parsed.username || parsed.opusername || '';
  } catch (error) {
    return raw;
  }

  return raw;
}

function UserComparator() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE}/api/ratings`, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Unable to load leaderboard');
      }

      const json = await response.json();
      const data = Array.isArray(json?.data) ? json.data : [];
      const rankedUsers = [...data]
        .filter((user) => user && user.opusername)
        .sort((a, b) => Number(b.compositeRating || 0) - Number(a.compositeRating || 0))
        .map((user, index) => ({ ...user, rank: index + 1 }));

      setRows(rankedUsers);

      const storedUser = getStoredUsername();
      const fallbackUser = rankedUsers[0]?.opusername || '';
      const activeUser = storedUser || fallbackUser;
      const compareUser = rankedUsers.find((user) => normalizeUsername(user.opusername) === normalizeUsername(activeUser))
        ? activeUser
        : rankedUsers[1]?.opusername || rankedUsers[0]?.opusername || '';

      setCurrentUser(activeUser);
      setSelectedUser(compareUser);
    } catch (err) {
      console.error('Failed to load comparator data:', err);
      setError('Unable to load user comparison data right now.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  const userList = useMemo(() => rows.slice(0, 20), [rows]);

  const activeUserRecord = useMemo(() => {
    if (!userList.length) return null;
    if (currentUser) {
      const match = userList.find((user) => normalizeUsername(user.opusername) === normalizeUsername(currentUser));
      if (match) return match;
    }
    return userList[0];
  }, [userList, currentUser]);

  const compareRecord = useMemo(() => {
    if (!userList.length) return null;
    if (selectedUser) {
      const match = userList.find((user) => normalizeUsername(user.opusername) === normalizeUsername(selectedUser));
      if (match) return match;
    }
    return userList[1] || userList[0];
  }, [userList, selectedUser]);

  if (loading) {
    return (
      <div className="rating-dashboard">
        <div className="rating-content-wrapper" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 18px 40px' }}>
          <Paper sx={{ p: 5, background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, color: '#e2e8f0' }}>
              <CircularProgress size={22} sx={{ color: '#fbbf24' }} />
              Loading comparator...
            </Box>
          </Paper>
        </div>
      </div>
    );
  }

  if (error || !activeUserRecord || !compareRecord) {
    return (
      <div className="rating-dashboard">
        <div className="rating-content-wrapper" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 18px 40px' }}>
          <Paper sx={{ p: 5, background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: 3 }}>
            <Typography sx={{ color: '#fca5a5', textAlign: 'center' }}>
              {error || 'No profile data available.'}
            </Typography>
          </Paper>
        </div>
      </div>
    );
  }

  const ratingGap = Number(compareRecord.compositeRating || 0) - Number(activeUserRecord.compositeRating || 0);
  const rankGap = Number(compareRecord.rank || 1) - Number(activeUserRecord.rank || 1);
  const percentile = ((rows.length - (activeUserRecord.rank || 1) + 1) / Math.max(rows.length, 1)) * 100;
  const performanceText = ratingGap > 0
    ? `${Math.abs(ratingGap)} OP points behind ${compareRecord.opusername}`
    : ratingGap < 0
      ? `${Math.abs(ratingGap)} OP points ahead of ${compareRecord.opusername}`
      : 'Perfectly matched in OP rating';

  const rankText = rankGap > 0
    ? `${Math.abs(rankGap)} place${Math.abs(rankGap) > 1 ? 's' : ''} behind`
    : rankGap < 0
      ? `${Math.abs(rankGap)} place${Math.abs(rankGap) > 1 ? 's' : ''} ahead`
      : 'Tied on rank';

  const platformStats = [
    { label: 'Codeforces', value: Number(activeUserRecord.codeforcesRating || 0) },
    { label: 'CodeChef', value: Number(activeUserRecord.codechefRating || 0) },
    { label: 'AtCoder', value: Number(activeUserRecord.atcoderRating || 0) },
    { label: 'LeetCode', value: Number(activeUserRecord.leetcodeRating || 0) },
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
            <span className="section-kicker">Insights</span>
            <h1 className="rating-heading" style={{ margin: 0 }}>User Comparator</h1>
          </div>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Select
              value={selectedUser}
              onChange={(event) => setSelectedUser(event.target.value)}
              size="small"
              sx={{
                minWidth: 220,
                background: 'rgba(15, 23, 42, 0.5)',
                color: '#f8fafc',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(148, 163, 184, 0.5)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#fbbf24',
                },
                '& .MuiSelect-select': {
                  color: '#f8fafc',
                },
                '& .MuiSelect-icon': {
                  color: '#fbbf24',
                },
              }}
            >
              {userList.map((user) => (
                <MenuItem key={user.opusername} value={user.opusername} sx={{ color: '#e2e8f0' }}>
                  {user.opusername}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </div>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2.5, background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: 3 }}>
            <Typography sx={{ color: '#cbd5e1', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Your Rank</Typography>
            <Typography sx={{ color: '#fbbf24', fontSize: 30, fontWeight: 800 }}>#{activeUserRecord.rank}</Typography>
            <Typography sx={{ color: '#e2e8f0', mt: 1 }}>{activeUserRecord.opusername}</Typography>
          </Paper>

          <Paper sx={{ p: 2.5, background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: 3 }}>
            <Typography sx={{ color: '#cbd5e1', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Selected User</Typography>
            <Typography sx={{ color: '#fbbf24', fontSize: 30, fontWeight: 800 }}>#{compareRecord.rank}</Typography>
            <Typography sx={{ color: '#e2e8f0', mt: 1 }}>{compareRecord.opusername}</Typography>
          </Paper>

          <Paper sx={{ p: 2.5, background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: 3 }}>
            <Typography sx={{ color: '#cbd5e1', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Rating Gap</Typography>
            <Typography sx={{ color: ratingGap >= 0 ? '#22c55e' : '#fca5a5', fontSize: 26, fontWeight: 800 }}>
              {ratingGap >= 0 ? '+' : ''}{ratingGap}
            </Typography>
            <Typography sx={{ color: '#e2e8f0', mt: 1 }}>{performanceText}</Typography>
          </Paper>

          <Paper sx={{ p: 2.5, background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: 3 }}>
            <Typography sx={{ color: '#cbd5e1', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Position</Typography>
            <Typography sx={{ color: '#fbbf24', fontSize: 26, fontWeight: 800 }}>{rankText}</Typography>
            <Typography sx={{ color: '#e2e8f0', mt: 1 }}>{Math.round(percentile)}% percentile</Typography>
          </Paper>
        </Box>

        <Paper sx={{ p: 3, background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: 3, mb: 3 }}>
          <Typography sx={{ color: '#fbbf24', fontSize: 24, fontWeight: 800, mb: 2 }}>Comparison Summary</Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#fbbf24', fontWeight: 800, background: 'rgba(15, 23, 42, 0.7)' }}>Metric</TableCell>
                  <TableCell sx={{ color: '#fbbf24', fontWeight: 800, background: 'rgba(15, 23, 42, 0.7)' }}>{activeUserRecord.opusername}</TableCell>
                  <TableCell sx={{ color: '#fbbf24', fontWeight: 800, background: 'rgba(15, 23, 42, 0.7)' }}>{compareRecord.opusername}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: '#e2e8f0' }}>Rank</TableCell>
                  <TableCell sx={{ color: '#e2e8f0' }}>#{activeUserRecord.rank}</TableCell>
                  <TableCell sx={{ color: '#e2e8f0' }}>#{compareRecord.rank}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#e2e8f0' }}>OP Rating</TableCell>
                  <TableCell sx={{ color: '#e2e8f0' }}>{Number(activeUserRecord.compositeRating || 0)}</TableCell>
                  <TableCell sx={{ color: '#e2e8f0' }}>{Number(compareRecord.compositeRating || 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#e2e8f0' }}>Country</TableCell>
                  <TableCell sx={{ color: '#e2e8f0' }}>{activeUserRecord.country || '—'}</TableCell>
                  <TableCell sx={{ color: '#e2e8f0' }}>{compareRecord.country || '—'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper sx={{ p: 3, background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: 3 }}>
          <Typography sx={{ color: '#fbbf24', fontSize: 24, fontWeight: 800, mb: 2 }}>Platform Snapshot</Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#fbbf24', fontWeight: 800, background: 'rgba(15, 23, 42, 0.7)' }}>Platform</TableCell>
                  <TableCell sx={{ color: '#fbbf24', fontWeight: 800, background: 'rgba(15, 23, 42, 0.7)' }}>{activeUserRecord.opusername}</TableCell>
                  <TableCell sx={{ color: '#fbbf24', fontWeight: 800, background: 'rgba(15, 23, 42, 0.7)' }}>Relative</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {platformStats.map((platform) => {
                  const rivalValue = Number(compareRecord[`${platform.label.toLowerCase().replace(/[^a-z]/g, '')}Rating`] || 0);
                  const delta = rivalValue - platform.value;

                  return (
                    <TableRow key={platform.label}>
                      <TableCell sx={{ color: '#e2e8f0' }}>{platform.label}</TableCell>
                      <TableCell sx={{ color: '#e2e8f0' }}>{platform.value}</TableCell>
                      <TableCell sx={{ color: delta >= 0 ? '#22c55e' : '#fca5a5' }}>
                        {delta > 0 ? `+${delta}` : delta}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
}

export default UserComparator;
