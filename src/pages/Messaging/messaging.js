import React, { useEffect, useRef, useState } from 'react';
import { Layout, Avatar, Input, Tooltip, Image } from 'antd';
import { ImAttachment } from 'react-icons/im';
import { GrEmoji } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { AiFillFile, AiFillFilePdf } from 'react-icons/ai';
import './messaging.css';

const { Content } = Layout;

function Messaging()
{
    const [chatData, setChatData] = useState({});

    const lastMessageRef = useRef(null);
    const imagesRef = useRef(null);
    const [chatmessage, setchatmessage] = useState('');
    const [attachments, setattachments] = useState([]);

    const scrollToBottom = () =>
    {
        lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    };


    useEffect(() =>
    {
        setChatData({     //change data to orginal chat data from backend
            name: 'Bentley Systems',
            messages: [
                {
                    id: 1,
                    message: 'Hello',
                    sender: 'user',
                    time: '12:00 pm',
                    owner: 'Harendra',
                    attachments: [
                        {
                            id: 1,
                            name: 'image1',
                            type: 'image',
                            url: 'https://www.cyberark.com/wp-content/uploads/2019/11/Developer.jpg'
                        }
                    ]
                },
                {
                    id: 2,
                    message: 'Hi',
                    sender: 'bot',
                    time: '12:01 pm',
                    owner: 'Sameer Kumar',
                    attachments: [
                        {
                            id: 1,
                            name: 'image1',
                            type: 'image',
                            url: 'https://www.cyberark.com/wp-content/uploads/2019/11/Developer.jpg'
                        }, {
                            id: 2,
                            name: 'image2',
                            type: 'image',
                            url: 'https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg'
                        }
                    ]
                },
                {
                    id: 3,
                    message: 'How are you?',
                    sender: 'user',
                    time: '12:02 pm',
                    owner: 'Harendra'
                },
                {
                    id: 4,
                    message: 'I am f',
                    sender: 'bot',
                    time: '12:03 pm',
                    owner: 'Sameer Kumar'
                },
                {
                    id: 5,
                    message: 'I am ',
                    sender: 'bot',
                    time: '12:03 pm',
                    owner: 'Sameer Kumar'
                },
            ]
        });
    }, []);

    useEffect(() =>
    {
        scrollToBottom();
    }, [chatData]);

    function handleSend(e)
    {
        e.preventDefault();
        const message = chatmessage;
        if (attachments || (message && message.length > 0))
        {
            const newMessage = {
                id: chatData.messages.length + 1,
                message: message,
                sender: 'user',
                time: '12:00 pm',
                owner: 'Harendra',
                attachments: attachments
            };
            setChatData({
                ...chatData,
                messages: [...chatData.messages, newMessage]
            });
            setchatmessage('');
            setattachments([]);
        }
    }

    function handleImageChange(e)
    {
        e.preventDefault();
        setattachments([]);
        for (let i = 0; i < e.target.files.length; i++)
        {
            const file = e.target.files[i];
            console.log(file);
            if (!file) return;
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onloadend = function (e)
            {
                const newAttachment = {
                    id: attachments.length + 1,
                    name: file.name,
                    type: file.type.split("/")[0],
                    fullType: file.type,
                    url: e.target.result
                };
                setattachments([...attachments, newAttachment]);
            };
        }
        e.target.value = '';
    }

    return (
        <Layout className='chat-layout'>
            <div className='header'>
                <div className="icon">
                    <Avatar size={40} className='avatar'>AK</Avatar>
                </div>
                <div className="Project-name">
                    <h1>Akarsh Kashyap</h1>
                </div>

            </div>
            <Content className='content'>
                <div className="chat-messages" style={{ height: window.innerHeight - 200 }}>
                    {chatData.messages && chatData.messages.map((message, index) =>
                    {   //change data to orginal chat data from backend
                        return (
                            <div className='chat-message' key={index} >
                                <div className={`${message.sender === 'user' ? 'chat-message-user' : 'chat-message-other'}`}>
                                    <div className="chat-message-header">
                                        <div className={`${message.sender === 'user' ? 'chat-message-owner-user' : 'chat-message-owner-other'}`}>
                                            {message.owner},
                                        </div>
                                        <div className="chat-message-time">
                                            {message.time}
                                        </div>
                                    </div>
                                    {message?.attachments && message?.attachments?.map((attachment, index) =>
                                    {
                                        if (attachment.type === 'image')
                                        {
                                            return (
                                                <div className="chat-message-image" key={index}>
                                                    <Image key={index}
                                                        width={200}
                                                        src={attachment.url}
                                                    />
                                                </div>
                                            );
                                        }
                                        else if (attachment.type === 'video')
                                        {
                                            return (
                                                <div className="chat-message-image" key={index}>
                                                    <video width="320" height="240" controls>
                                                        <source src={attachment.url} type="video/mp4" />
                                                    </video>
                                                </div>
                                            );
                                        }

                                        else if (attachment.type === 'application' && attachment?.fullType === 'application/pdf')
                                        {
                                            return (
                                                <div className="chat-message-image" key={index}>
                                                    {/* <AiFillFilePdf />
                                                    <span>{attachment.name}</span> */}
                                                    <iframe src={attachment.url} width="100%" height="500px"></iframe>
                                                </div>
                                            );
                                        }
                                        else
                                        {
                                            return (
                                                <div className="chat-message-image" key={index}>
                                                    <AiFillFile />
                                                    <span>{attachment.name}</span>
                                                </div>
                                            );
                                        }

                                    })}
                                    {message?.message && message?.message.length > 0 &&
                                        <div className={`${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-other'}`} >
                                            <div className="chat-message-text">
                                                {message?.message}
                                            </div>
                                        </div>
                                    }
                                </div>

                            </div>

                        );
                    })}
                    <div ref={lastMessageRef}>
                    </div>
                </div>
            </Content>
            <Content className='footer'>

                <div className="chat-input-wrapper">
                    <div className="chat-input-icons">
                        <label htmlFor="attachment">
                            <Tooltip placement="top" title="Select one or multiple files">
                                <ImAttachment className="attachment-icon" size={25} />
                            </Tooltip>
                        </label>
                        <input type="file" name="attachment" id="attachment" className='attachment' multiple={true} onChange={handleImageChange} ref={imagesRef} />
                        <GrEmoji className="emoji-icon" size={25} />
                    </div>
                    <Input placeholder="Type a Message" className='chat-input' value={chatmessage} onChange={(e) => setchatmessage(e.target.value)} onPressEnter={handleSend} />
                    <div className="chat-send-button" onClick={handleSend}>
                        <IoSend size={30} />
                    </div>
                </div>
            </Content >
        </Layout >

    );
}

export default Messaging;

    // async function fetchMessages(){
    //     const token=localStorage.getItem("token");
    //     let result=await fetch('http://localhost:5000/messaging',{
    //         method:'post',
    //         headers:{
    //             Authorization:`Bearer ${token}`
    //         }
    //     });
    //     result=await result.json();
    //     console.log(result);
    // }