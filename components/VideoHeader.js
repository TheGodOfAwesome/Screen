import React, { Component, useEffect, useState } from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import axios from 'axios';
import moment from 'moment';
import { 
    MDBMask, MDBCard, MDBCardBody, MDBContainer, MDBRow, 
    MDBCol, MDBBtn, MDBModal, MDBModalBody, MDBIcon, MDBFooter 
} from 'mdbreact';
import Countdown from './Countdown';

export default function VideoHeader() {
    const [modal, setModal] = useState(false);
    const [startEvent, setStartEvent] = useState(false);
    const [eventId, setEventId] = useState(false);
    const [eventMetadata, setEventMetadata] = useState([]);
    const [eventVideo, setEventVideo] = useState("./assets/video/glitch.mp4");
    const [secsToEvent, setSecsToEvent] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [pass, setPass] = useState(false);
    let tomorrow  = new Date();
    let startsAt = new moment(tomorrow).format('MM DD YYYY, h:mm a');
    const [nextStartTime, setNextStartTime] = useState(startsAt);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getNextEvent();
        }
        fetchData();
        setInterval(() => {
            fetchData();
            if(secsToEvent < 15 && !(secsToEvent < 0)) {
                setStartEvent(true);
            }
        }, 1000);
        setInterval(() => {
            // fetchData(); 
        }, 60000);
    }, [])

    function endStream() {
        console.log("video ended");
        setStartEvent(false);
        gradeAnswers();
        deleteEvent();
    }

    async function getNextEvent () {
        const url = process.env.NEXT_PUBLIC_LORE_EVENTS_SERVICE;
        axios.get(
            url,
                {
                    params: {
                        api_key: process.env.NEXT_PUBLIC_LORE_EVENTS_SERVICE_API_KEY,
                        token: "sdfsfrfsvefwecewfewfefewfefewfefe",
                        page_size: 1
                    }
                }
            ).then(res => {
                var response = res.data;
                if(response.responsePayload.length > 0) {
                    var nextEvent = response.responsePayload[0];
                    var startTimestamp = Number(nextEvent.event_start);
                    var videoUrl = nextEvent.event_video;
                    var metadata = nextEvent.event_response_metadata;

                    console.log("Metadata: ");
                    setEventMetadata(JSON.parse(metadata));
                    console.log(JSON.parse(metadata));

                    console.log("Start: ");
                    console.log(startTimestamp);

                    console.log("Today: ");
                    var today = + new Date();
                    today = today.toString().substring(0, 10)
                    console.log(Number(today));

                    const unix_timestamp = startTimestamp - Number(today);
                    console.log("Secs to event: ");
                    console.log(unix_timestamp);
                    setSecsToEvent(unix_timestamp);
                    
                    console.log(videoUrl);
                    if(secsToEvent < 15 && !(secsToEvent < 0)) {
                        setEventVideo(videoUrl);
                    }

                    const time = new moment.unix(startTimestamp).format('MM DD YYYY, h:mm a')
                    setNextStartTime(time);
                }
            }
        );
    }

    async function deleteEvent () {
        const url = process.env.NEXT_PUBLIC_LORE_EVENTS_SERVICE;
        axios.delete(
            url,
                {
                    params: {
                        api_key: process.env.NEXT_PUBLIC_LORE_EVENTS_SERVICE_API_KEY,
                        token: "sdfsfrfsvefwecewfewfefewfefewfefe",
                        event_id: eventId
                    }
                }
            ).then(res => {
                var response = res.data;
                console.log("Deleted Response: ");
                console.log(response);
            }
        );
    }

    function addAnswer(answer) {
        answers.push(answer);
        setAnswers(answers);
    }

    function gradeAnswers() {
        let count = 0;
        let passVar = true;
        answers.map(answerItem => {
            if(answerItem.answer !== metadata[count]) {
                passVar = false;
            }
        });
        setAnswers([]);
        setPass(passVar)
        setModal(true);
    }

    return (
        <div>
            <header>
                <div className="view" style={{maxHeight:"100vh"}}>
                    {
                        (secsToEvent < 15)
                        ?
                            <video onEnded={() => endStream()} className="video-fluid" playsInline="playsinline" autoPlay="autoplay" muted={true} loop="loop">
                                <source src={eventVideo} type="video/mp4"/>
                            </video>
                        :
                            <video className="video-fluid" playsInline="playsinline" autoPlay="autoplay" muted={true} loop="loop">
                                <source src="./assets/video/glitch.mp4" type="video/mp4"/>
                            </video>
                    }
                    <div className="mask flex-center ">
                    </div>
                    <MDBMask className="d-flex justify-content-center align-items-center">
                        <MDBContainer className="d-flex justify-content-center align-items-center">
                            {
                                (secsToEvent < 15)
                                ?
                                    <></>
                                :
                                    <Countdown timeTillDate={nextStartTime} timeFormat="MM DD YYYY, h:mm a"/>
                            }
                            { 
                                (secsToEvent < 15)
                                &&
                                <MDBCard style={{ position: "fixed", bottom: 5, width:"500px", backgroundColor:"transparent"}}>
                                    <MDBCardBody className='text-center text-white transparent' s>
                                        <MDBRow>
                                            <MDBCol style={{ width: "100%", padding: "0px"}}>
                                                <button onClick={() => {addAnswer("A")}} style={{ width: "100%", backgroundColor: "#4c09a9" }} type="button" className="btn"  hover>
                                                    A
                                                </button>
                                            </MDBCol>
                                            <MDBCol>
                                                <button onClick={() => {addAnswer("B")}} style={{ width: "100%", backgroundColor: "#4c09a9" }} type="button" className="btn"  hover>
                                                    B
                                                </button>
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow>
                                            <MDBCol style={{ width: "100%", padding: "0px"}}>
                                                <button onClick={() => {addAnswer("C")}} style={{ width: "100%", backgroundColor: "#4c09a9" }} type="button" className="btn" hover>
                                                    C
                                                </button>
                                            </MDBCol>
                                            <MDBCol>
                                                <button onClick={() => {addAnswer("D")}} style={{ width: "100%", backgroundColor: "#4c09a9" }} type="button" className="btn" hover>
                                                    D
                                                </button>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBCardBody>
                                </MDBCard>
                            }
                        </MDBContainer>
                    </MDBMask>
                    
                    <MDBContainer>
                        <MDBModal isOpen={modal} toggle={() => {setModal()}} side position="top-right">
                            <MDBModalBody toggle={() => {setModal()}}  className="form">
                                {
                                    (pass)
                                    ?
                                        <button onClick={() => {console.log("reward")}} style={{ width: "100%", backgroundColor: "#4c09a9" }} type="button" className="btn" hover>
                                            Mint Reward
                                        </button>
                                    :
                                        <h2 style={{color: "#4c09a9"}}>Awesome Attempt Better Luck Next Time!</h2>
                                }
                            </MDBModalBody>
                        </MDBModal>
                    </MDBContainer>
                </div>
            </header>
        </div>
    )
}