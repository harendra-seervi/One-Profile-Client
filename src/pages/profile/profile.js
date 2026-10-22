import React, { useEffect, useState } from 'react';
import './profile.css';
import { useParams } from 'react-router-dom';
import Chart from "react-apexcharts";
import { Box, Paper, CircularProgress } from '@mui/material';
import { FiExternalLink } from 'react-icons/fi';

// Custom Heatmap Component
const ActivityHeatmap = ({ platformName }) => {
  const generateHeatmapData = () => {
    const weeks = 26; // 6 months instead of 52
    const data = [];
    
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < 7; day++) {
        data.push({
          value: Math.floor(Math.random() * 50),
          week,
          day
        });
      }
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  const maxValue = Math.max(...heatmapData.map(d => d.value));
  
  const getColor = (value) => {
    if (value === 0) return 'rgba(30, 30, 30, 0.3)';
    if (value < 10) return 'rgba(34, 197, 94, 0.15)';
    if (value < 20) return 'rgba(34, 197, 94, 0.35)';
    if (value < 30) return 'rgba(34, 197, 94, 0.55)';
    if (value < 40) return 'rgba(34, 197, 94, 0.75)';
    return '#22c55e';
  };

  return (
    <div className='custom-heatmap'>
      <div className='heatmap-grid'>
        {heatmapData.map((cell, idx) => (
          <div
            key={idx}
            className='heatmap-cell'
            style={{ backgroundColor: getColor(cell.value) }}
            title={`${cell.value} submissions`}
          />
        ))}
      </div>
      <div className='heatmap-stats'>
        <div className='stat-item'>
          <span className='stat-value'>{Math.floor(Math.random() * 500) + 100}</span>
          <span className='stat-label'>problems solved all time</span>
        </div>
        <div className='stat-item'>
          <span className='stat-value'>{Math.floor(Math.random() * 50) + 5}</span>
          <span className='stat-label'>days in a row max</span>
        </div>
      </div>
    </div>
  );
};

// API base URL — use localhost during development
const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://one-profile-server.vercel.app'
  : 'http://localhost:5000';

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [opusername, setUserName] = useState("");
  const [country, setCountry] = useState("");
  const [codeforces, setCodeforcesHandle] = useState("");
  const [codechef, setCodechefHandle] = useState("");
  const [atcoder, setAtcoderHandle] = useState("");
  const [leetcode, setLeetcodeHandle] = useState("");
  const [OP, setOP] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [lastRatingUpdate, setLastRatingUpdate] = useState("");

  let opRating = 0;

  const [lineGraphData, setLineGraphData] = useState({
    options: {
      chart: {
        id: "basic-bar",
        background: "transparent"
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      }
    },
    series: [
      {
        name: "Codeforces",
        data: [1130, 1140, 1145, 1150, 1049, 1060, 1470, 1591]
      },
      {
        name: "Codechef",
        data: [910, 1270, 1585, 1810, 1379, 1280, 1190, 1791]
      }
    ]
  });

  const [progress, setProgress] = useState({
    series: [{
      data: [0, 0, 0, 0, 0]
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
        background: "transparent"
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: [
          ['CodeForces'],
          ['CodeChef'],
          ['AtCoder'],
          ['LeetCode'],
          ['OneProfile'],
        ],
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      }
    },
  });

  const params = useParams();
  const { username } = params;

  useEffect(() => {
    setIsLoading(true);
    getUserData(username);
  }, [username]);

  async function getUserData(userName) {
    try {
      setIsLoading(true);
      const normalizedUser = (userName || '').trim();
      const url = `${API_BASE}/api/profile/${encodeURIComponent(normalizedUser)}`;
      let userInfo = await fetch(url);

      if (!userInfo.ok) {
        setIsLoading(false);
        return;
      }

      userInfo = await userInfo.json();

      if (!userInfo || !userInfo.success || !userInfo.data) {
        setIsLoading(false);
        return;
      }

      const userData = userInfo.data;
      setName(userData.name || '');
      setEmail(userData.email || '');
      setUserName(userData.opusername || normalizedUser);
      setCountry(userData.country || '');
      setCodeforcesHandle(userData.codeforces || '');
      setCodechefHandle(userData.codechef || '');
      setAtcoderHandle(userData.atcoder || '');
      setLeetcodeHandle(userData.leetcode || '');
      
      if (userData.lastRatingUpdate) {
        const lastUpdate = new Date(userData.lastRatingUpdate);
        setLastRatingUpdate(lastUpdate.toLocaleString());
      } else {
        setLastRatingUpdate('');
      }

      const opfinal = Number(userData.compositeRating || 0);

      setProgress({
        series: [{
          data: [
            Number(userData.codeforcesRating || 0),
            Number(userData.codechefRating || 0),
            Number(userData.atcoderRating || 0),
            Number(userData.leetcodeRating || 0),
            opfinal,
          ]
        }],
        options: {
          chart: {
            height: 350,
            type: 'bar',
            background: "transparent"
          },
          plotOptions: {
            bar: {
              columnWidth: '45%',
              distributed: true,
            }
          },
          dataLabels: {
            enabled: false
          },
          legend: {
            show: false
          },
          xaxis: {
            categories: [
              ['CodeForces'],
              ['CodeChef'],
              ['AtCoder'],
              ['LeetCode'],
              ['OneProfile'],
            ],
            labels: {
              style: {
                fontSize: '12px'
              }
            }
          }
        },
      });

      setOP(opfinal);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setIsLoading(false);
    }
  }

  let cfLink = "https://codeforces.com/profile/" + codeforces;
  let ccLink = "https://www.codechef.com/users/" + codechef;
  let atLink = "https://atcoder.jp/users/" + atcoder;
  let lcLink = "https://leetcode.com/" + leetcode;

  const getRankBadge = (rating) => {
    const r = Number(rating);
    
    if (r >= 2400) return { label: 'Red', color: '#ef4444', bgColor: '#7f1d1d' };
    if (r >= 2100) return { label: 'Master', color: '#ff8c00', bgColor: '#7c2d12' };
    if (r >= 1900) return { label: 'Expert', color: '#06b6d4', bgColor: '#164e63' };
    if (r >= 1600) return { label: 'Specialist', color: '#2dd4bf', bgColor: '#134e4a' };
    if (r >= 1200) return { label: 'Pupil', color: '#fbbf24', bgColor: '#78350f' };
    if (r > 0) return { label: 'Newbie', color: '#64748b', bgColor: '#1e293b' };
    return { label: 'Unrated', color: '#a1a5b4', bgColor: '#0f172a' };
  };

  const rankBadge = getRankBadge(Number(OP));

  return (
    <div className='profile-div-background-page'>
      <div className='profile-page-wrapper'>
      <Box className='profile-header-section'>
        <div className='profile-header-glow' />
        <div className='profile-content-wrap'>
          <div className='profile-user-card-wrap'>
            <Paper className='profile-user-card' elevation={0}>
              <div className='profile-avatar-section'>
                <img
                  className='profile-avatar'
                  src='https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp'
                  alt='Profile'
                />
                <div className='profile-flag-badge'>
                  <img
                    src="https://flagcdn.com/w40/in.png"
                    alt="Country Flag"
                  />
                </div>
              </div>

              <div className='profile-info-section'>
                <h1 className='profile-user-name'>{name}</h1>
                <p className='profile-username'>@{opusername}</p>

                <div 
                  className='profile-rating-badge'
                  style={{ 
                    backgroundColor: rankBadge.bgColor,
                    borderColor: rankBadge.color
                  }}
                >
                  <span className='profile-rating-value' style={{ color: rankBadge.color }}>
                    {OP}
                  </span>
                  <span className='profile-rating-label' style={{ color: rankBadge.color }}>
                    {rankBadge.label}
                  </span>
                </div>

                <div className='profile-meta-grid'>
                  <div className='profile-meta-item'>
                    <span className='profile-meta-label'>Email</span>
                    <span className='profile-meta-value'>{email}</span>
                  </div>
                  <div className='profile-meta-item'>
                    <span className='profile-meta-label'>Country</span>
                    <span className='profile-meta-value'>{country}</span>
                  </div>
                </div>

                <div className='profile-links-section'>
                  <span className='profile-links-label'>Verify Profiles</span>
                  <p className='profile-links-description'>Cross-check ratings on official platforms</p>
                  <div className='profile-links-grid'>
                    {codeforces && <a href={cfLink} target="_blank" rel="noopener noreferrer" className='profile-link-btn' title="Visit CodeForces Profile">
                      CodeForces <FiExternalLink className='profile-link-icon' />
                    </a>}
                    {codechef && <a href={ccLink} target="_blank" rel="noopener noreferrer" className='profile-link-btn' title="Visit CodeChef Profile">
                      CodeChef <FiExternalLink className='profile-link-icon' />
                    </a>}
                    {atcoder && <a href={atLink} target="_blank" rel="noopener noreferrer" className='profile-link-btn' title="Visit AtCoder Profile">
                      AtCoder <FiExternalLink className='profile-link-icon' />
                    </a>}
                    {leetcode && <a href={lcLink} target="_blank" rel="noopener noreferrer" className='profile-link-btn' title="Visit LeetCode Profile">
                      LeetCode <FiExternalLink className='profile-link-icon' />
                    </a>}
                  </div>
                </div>

                {lastRatingUpdate && (
                  <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderLeft: '3px solid #22c55e',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#d1d5db'
                  }}>
                    <p style={{ margin: '0 0 5px 0' }}>
                      <strong>Last Rating Update:</strong> {lastRatingUpdate}
                    </p>
                    <p style={{ margin: '0' }}>
                      💡 Ratings update every 4 hours automatically
                    </p>
                  </div>
                )}
              </div>
            </Paper>
          </div>

          <div className='profile-charts-container'>
            <Paper className='profile-chart-card' elevation={0}>
              <div className='profile-chart-header'>
                <h2>Highest Ratings</h2>
                <p>Across all platforms</p>
              </div>
              {isLoading ? (
                <Box className='profile-loading-state'>
                  <CircularProgress size={40} sx={{ color: '#fbbf24' }} />
                </Box>
              ) : (
                <Chart
                  options={progress.options}
                  series={progress.series}
                  type="bar"
                  height={350}
                />
              )}
            </Paper>

            <Paper className='profile-chart-card' elevation={0}>
              <div className='profile-chart-header'>
                <h2>Rating Progression</h2>
                <p>Over time</p>
              </div>
              {isLoading ? (
                <Box className='profile-loading-state'>
                  <CircularProgress size={40} sx={{ color: '#fbbf24' }} />
                </Box>
              ) : (
                <Chart
                  options={lineGraphData.options}
                  series={lineGraphData.series}
                  type="line"
                  height={350}
                />
              )}
            </Paper>

            <div className='profile-heatmaps-grid'>
              <Paper className='profile-heatmap-card' elevation={0}>
                <div className='profile-heatmap-header'>
                  <h3>CodeForces</h3>
                </div>
                <ActivityHeatmap platformName="CodeForces" />
              </Paper>

              <Paper className='profile-heatmap-card' elevation={0}>
                <div className='profile-heatmap-header'>
                  <h3>CodeChef</h3>
                </div>
                <ActivityHeatmap platformName="CodeChef" />
              </Paper>

              <Paper className='profile-heatmap-card' elevation={0}>
                <div className='profile-heatmap-header'>
                  <h3>AtCoder</h3>
                </div>
                <ActivityHeatmap platformName="AtCoder" />
              </Paper>

              <Paper className='profile-heatmap-card' elevation={0}>
                <div className='profile-heatmap-header'>
                  <h3>LeetCode</h3>
                </div>
                <ActivityHeatmap platformName="LeetCode" />
              </Paper>
            </div>
          </div>
        </div>
      </Box>
      </div>
    </div>
  );
}

export default Profile;
