import { useEffect, useState } from 'react';
import './profile.css'
import { useParams } from 'react-router-dom';
import Chart from "react-apexcharts";
import CalHeatmap from 'cal-heatmap';
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
            data: [1231, 1852, 1310, 1428, 1500]
        }],
        options: {
            chart: {
                height: 350,
                type: 'bar',
                events: {
                    click: function (chart, w, e) {
                    }
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
                    ['Spoj'],
                ],
                labels: {
                    style: {
                        // colors: colors,
                        fontSize: '12px'
                    }
                }
            }
        },


    });

    const [heatData, setHeatData] = useState({

        series: [{
            name: 'Metric1',
            data: generateData(18, {
                min: 0,
                max: 100
            })
        },
        {
            name: 'Metric2',
            data: generateData(18, {
                min: 0,
                max: 100
            })
        },
        {
            name: 'Metric3',
            data: generateData(18, {
                min: 0,
                max: 100
            })
        },
        {
            name: 'Metric4',
            data: generateData(18, {
                min: 0,
                max: 100
            })
        },
        {
            name: 'Metric5',
            data: generateData(18, {
                min: 0,
                max: 100
            })
        },
        {
            name: 'Metric6',
            data: generateData(18, {
                min: 0,
                max: 100
            })
        },
        {
            name: 'Metric7',
            data: generateData(18, {
                min: 0,
                max: 100
            })
        },
        
        ],
        options: {
            chart: {
                height: 500,
                width:200,
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
    })
    const params = useParams();
    const { username } = params;
    useEffect(() => {
        getUserData(username);
    }, [])

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
    }

    return (<div className='profile-div-backgound-page'>
        <div className='profile-page-card'>
            <div className='profile-component'>
                <div className='user-info-card'>
                    <div className='user-profile-info'>
                        <img className='profile-image' src='https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp'></img>
                        <img
                            className='flag'
                            src="https://flagcdn.com/w20/in.png"
                            srcset="https://flagcdn.com/w40/in.png 2x"
                            alt="India">
                        </img>

                        <h2 className='profile-name rating-color'>{name}</h2>
                    </div>
                    <div className='user-profile-info'>
                        <h4 className='about'>Username : {opusername}</h4>
                    </div>
                    <div className='user-profile-info'>
                        <h4 className='about'>OP Rating : 1231 </h4>
                        <h4 className='rating-color about'> (Pupil)</h4>
                    </div>
                    <div className='user-profile-info'>
                        <h4 className='about'>OP Rank : 2 </h4>
                    </div>
                    <div className='user-profile-info'>
                        <h4 className='about'>E-mail : {email}</h4>
                    </div>
                    <div className='user-profile-info'>
                        <h4 className='about'>Instituation : National Instituation of Engineering</h4>
                    </div>
                </div>
                <div className='heighest-rating-component'>
                    <h1 className='higherst-rating-heading'>Highest Ratings</h1>
                    <div id='chart'>
                        <Chart options={progress.options} series={progress.series} type="bar" height={379} />
                    </div>
                </div>
            </div>
            <div className='line-graph-component'>

                <h1 className='higherst-rating-heading'>Ratings Graphs</h1>
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
                <Chart options={heatData.options} series={heatData.series} type="heatmap" width={700} height={200} />
            </div>
        </div>
    </div>
    )
}
export default Profile;