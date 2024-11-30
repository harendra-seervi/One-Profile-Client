import React, { useEffect, useState } from 'react';
import './profile.css';
import { useParams } from 'react-router-dom';
import Chart from "react-apexcharts";
import { Heatmap } from "contribution-heatmap";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [opusername, setUserName] = useState("");
  const [country, setCountry] = useState("");
  const [cf, setCfHandle] = useState("");
  const [cc, setCCHandle] = useState("");
  const [at, setATHandle] = useState("");
  const [hr, setHRHandle] = useState("");
  const [sp, setSPHandle] = useState("");
  let opRating = 0;
  const [lineGraphData, setLineGraphData] = useState({
    options: {
      chart: {
        id: "basic-bar"
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

  function generateData(count, range) {
    const data = [];

    for (let i = 0; i < count; i++) {
      const x = i + 1;
      const y = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

      data.push({
        x,
        y,
        value: y
      });
    }

    return data;
  }

  const [progress, setProgress] = useState({
    series: [{
      data: [0, 0, 0, 0, 0]
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
        events: {
          click: function (chart, w, e) { }
        }
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
          ['HackerRank'],
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

  const [heatData, setHeatData] = useState({
    series: [
      {
        name: 'Metric1',
        data: generateData(1, {
          min: 0,
          max: 0
        })
      },
      {
        name: 'Metric2',
        data: generateData(8, {
          min: 10,
          max: 10
        })
      },
      {
        name: 'Metric3',
        data: generateData(4, {
          min: 10,
          max: 10
        })
      },
      {
        name: 'Metric4',
        data: generateData(9, {
          min: 10,
          max: 10
        })
      },
      {
        name: 'Metric5',
        data: generateData(3, {
          min: 10,
          max: 10
        })
      },
      {
        name: 'Metric6',
        data: generateData(9, {
          min: 10,
          max: 10
        })
      },
      {
        name: 'Metric7',
        data: generateData(500, {
          min: 100,
          max: 100
        })
      },
    ],
    options: {
      chart: {
        height: 500,
        width: 200,
        type: 'heatmap',
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#179a00"],
      title: {
        text: 'HeatMap Codeforces:-'
      },
    },
  });

  const params = useParams();
  const { username } = params;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    getUserData(username);
    setIsLoading(true);
  }, [username]);
  const [OP, setOP] = useState("Loading...");
  async function getUserData(userName) {
    let userInfo = await fetch(`http://localhost:5000/profile/${userName}`);
    userInfo = await userInfo.json();
    userInfo = userInfo[0];
    setName(userInfo.name);
    setEmail(userInfo.email);
    setUserName(userInfo.opusername);
    setCountry(userInfo.country);
    setCfHandle(userInfo.cf);
    setCCHandle(userInfo.cc);
    setATHandle(userInfo.at);
    setHRHandle(userInfo.hr);
    setSPHandle(userInfo.sp);
    let opfinal = Math.max(userInfo.cfrating, Number(userInfo.ccrating) - 612, Number(userInfo.atrating) + 222, Number(userInfo.sprating) - 317);
    if (opfinal <= 300) opfinal = 0;
    setProgress({
      series: [{
        data: [userInfo.cfrating, userInfo.ccrating, userInfo.atrating, userInfo.sprating, opfinal]
      }],
      options: {
        chart: {
          height: 350,
          type: 'bar',
          events: {
            click: function (chart, w, e) { }
          }
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
    opRating = opfinal;
    setOP(opRating);

  }
  let cfLink = "https://codeforces.com/profile/" + cf;
  let ccLink = "https://www.codechef.com/users/" + cc;
  let atLink = "https://atcoder.jp/users/" + at;
  let lcLink = "https://leetcode.com/" + sp;
  // const [cfProfileLink,setcfLink]=useState
  return (
    <div className='profile-div-backgound-page'>
      <div className='profile-page-card'>
        <div className='profile-component'>
          <div className='user-info-card'>
            <div className='user-profile-info'>
              <img className='profile-image' src='https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp'></img>
              <img
                className='flag'
                src="https://flagcdn.com/w20/in.png"
                srcSet="https://flagcdn.com/w40/in.png 2x"
                alt="India">
              </img>
              <h2 className='rating-color profile-name'>{name}</h2>
            </div>
            <div className='user-profile-info'>
              <h4 className='about'>Username : {opusername}</h4>
            </div>
            <div className='user-profile-info'>
              <h4 className='about'>OP Rating : {OP} </h4>

              {OP >= 1200 && OP <= 1400 ? <h4 className='rating-color about'> (Pupil)</h4>
                : OP < 1200 ? <h4 style={{ color: 'gray' }} className='rating-color about'> (Newbie)</h4> :
                  OP >= 1400 ? <h4 style={{ color: '#23cdd3' }} className='rating-color about'> (Spacialist)</h4> : null}
            </div>
            <div className='user-profile-info'>

              <h4 className='about'>
                Platforms Link :
                <a  style={{textDecoration:'none'}}href={cfLink} target="_blank">[Codeforces]</a>
                <a style={{textDecoration:'none'}} href={ccLink} target="_blank"> [CodeChef]</a>
                <a  style={{textDecoration:'none'}}href={atLink} target="_blank"> [AtCoder]</a>
                <a  style={{textDecoration:'none'}}href={lcLink} target="_blank"> [LeetCode] </a>
              </h4>
            </div>
            <div className='user-profile-info'>
              <h4 className='about'>E-mail : {email}</h4>
            </div>
            <div className='user-profile-info'>
              <h4 className='about'>Institution : National Institution of Engineering</h4>
            </div>
          </div>
          <div className='heighest-rating-component'>
            <h1 className=' higherst-rating-heading '>Highest Ratings</h1>
            {isLoading ? (
              <Chart options={progress.options} series={progress.series} type="bar" />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className='line-graph-component'>
          <h1 className='  higherst-rating-heading '>Ratings Graphs</h1>
          <div className='component-first-second-half'>
            <Chart
              options={lineGraphData.options}
              series={lineGraphData.series}
              type="line"
              width="1000"
              height="400"
            />
          </div>
        </div>
        <div className='heatmap-componet'>
          <h1 className='higherst-rating-heading'>HeatMap</h1>
          {isLoading ? (
            <>
              {/* <Heatmap />
              <Heatmap /> */}
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
