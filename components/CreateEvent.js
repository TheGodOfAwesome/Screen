import { useState } from "react";
import Router from 'next/router';
import axios from 'axios';
import { MDBContainer, MDBIcon, MDBRow, MDBCol } from "mdbreact";
import { 
    useMoralis
} from "react-moralis";
import LoadingSpinner from "./LoadingSpinner";
import bg from "../public/assets/image/bg.png";
import styles from '../styles/Create.module.css';
// import DatePicker from 'react-date-picker';
// import DtPicker from 'react-calendar-datetime-picker';
// import { DateTime } from 'react-datetime-bootstrap';
import Datetime from 'react-datetime';
import moment from 'moment';

const CreateEvent = () => {
    const { 
        authenticate, isAuthenticated, user, enableWeb3
    } = useMoralis();

    const [disabledSubmit, setDisabledSubmit] = useState(false);
    const [addQuestion, setAddQuestion] = useState(false);
    const [addNFT, setAddNFT] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [date, setDate] = useState(null)
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [time, setTime] = useState("");
    const [nft, setNft] = useState("");
    const [rangeValue, setRangeValue] = useState(50);
    const [imageUrl, setImageUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [answersArray, setAnswersArray] = useState([]);
    const [questionsArray, setQuestionsArray] = useState([]);
    const [whitelistArray, setWhitelistArray] = useState([]);
    const Questions = [];
    const Answers = [];
    const Whitelist = [];

    let yesterday = moment().subtract( 1, 'day' );
    let today = moment().subtract( 0, 'day' );
    let now = moment().subtract( 0, 'hour' );
    let valid = function( current ){
        return current.isAfter( yesterday );
    };
    let inputProps = {
        placeholder: 'Date Time',
        style: {
            borderColor: '#680de4 !important', 
            borderWidth:"2px",
            width: "400px"
        },
    };
        
    async function walletConnect() {
        await authenticate({signingMessage:"Lore Sign In"});
        enableWeb3();
        try{
            let addr = user.get('ethAddress');
        } catch(e) { 
            console.error(e);
        }
        window.location.reload();
    }
    
    const handleTimeChange = (v) => {
        console.log(String(v));
        if (v) {
            setDate(v);
            console.log(v);
        }
    }
    
    const openAddQuestion = () => {
        setAddNFT(false);
        setAddQuestion(!addQuestion);
    }
    
    const pushQuestion = () => {
        console.log(question + " " + answer + " " + time);
        if (question == "" && answer == "" && time =="") {
            const error = 'Please check that all Question information has been entered correctly!';
            setErrorMessage(error);
        } else {
            const q = {
                id: questionCount,
                question: question,
                time: time
            }
            const a = {
                id: questionCount,
                answer: answer,
                time: time
            }
            Questions.push(q);
            Answers.push(a);

            answersArray.push(q);
            questionsArray.push(a);

            setQuestionsArray(answersArray);
            setAnswersArray(questionsArray);
            console.log(answersArray);
            console.log(questionsArray);

            setQuestion("");
            setAnswer("");
            setTime("");
        }
    }
    
    const pushWhitelist = () => {
        if (nft == "") {
            const error = 'Please check that all Question information has been entered correctly!';
            setErrorMessage(error);
        } else {
            Whitelist.push(nft);
            whitelistArray.push(nft);
            setWhitelistArray(whitelistArray);
            console.log(whitelistArray)

            setNft("");;
        }
    }
        
    const openAddNftGate = () => {
        setAddQuestion(false);
        setAddNFT(!addNFT);
    }

    const handleAddQuestion = () => {
        setErrorMessage("");
        setAddNFT(false);
        setAddQuestion(!addQuestion);
        setQuestionCount(questionCount + 1);
        console.log(question + " " + answer + " " + time);
        pushQuestion();
        alert('Question Added!');
    }
        
    const handleAddNftGate = () => {
        setErrorMessage("");
        setAddQuestion(false);
        setAddNFT(!addNFT);
        pushWhitelist();
        alert('NFT Gate Added!');
    }
        
    const handleQuestionChange = (e) => {
        if (e.target.value !== null) {
            setQuestion(e.target.value);
        }
    }
        
    const handleAnswerChange = (e) => {
        if (e.target.value !== null) {
            setAnswer(e.target.value);
        }
    }
        
    const handleTimeCodeChange = (e) => {
        if (e.target.value !== null) {
            setTime(e.target.value);
        }
    }

    const handleNftChange = (e) => {
        if (e.target.value !== null) {
            setNft(e.target.value);
        }
    }

    function handleFiles(files) {
        console.log("handleFiles");
        console.log(files);
        for (let i = 0; i < files.length; i++) {
            console.log(files[i]);
            uploadFile(files[i]);
        }
    }

    async function uploadFile(file) {
        const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/upload`;
        const xhr = new XMLHttpRequest();
        const fd = new FormData();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        // Update progress (can be used to show progress indicator)
        xhr.upload.addEventListener("progress", (e) => {
            setProgress(Math.round((e.loaded * 100.0) / e.total));
            setErrorMessage(Math.round((e.loaded * 100.0) / e.total));
            console.log(Math.round((e.loaded * 100.0) / e.total));
        });

        xhr.onreadystatechange = (e) => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const response = JSON.parse(xhr.responseText);
                setImageUrl(response.secure_url);
                console.log(response.secure_url);
            }
        };

        fd.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );
        fd.append("tags", "browser_upload");
        fd.append("file", file);
        xhr.send(fd);
    }

    const handleSubmit = (e, data) => {
        e.preventDefault();
        if (
            !e.target.eventName.value || !e.target.eventDesc.value || 
            !date || !rangeValue 
            // ||
            // Array.isArray(answersArray) || answersArray.length || Array.isArray(questionsArray) || questionsArray.length
        ){
            const error = 'Please check that all information has been entered correctly!';
            setErrorMessage(error);
        } else {

            if (!isAuthenticated && !user ) {
                walletConnect();
            }
            
            const unix_timestamp = date.unix();
            console.log(date.unix());
            setLoading(true);

            axios.put(
                process.env.NEXT_PUBLIC_LORE_EVENTS_SERVICE, 
                {
                    event_name: e.target.eventName.value,
                    event_creator: user.get('ethAddress'),
                    event_desc: e.target.eventDesc.value,
                    event_capacity: rangeValue,
                    event_wallet: user.get('ethAddress'),
                    event_video: imageUrl,
                    event_metadata: JSON.stringify(questionsArray),
                    event_response_metadata: JSON.stringify(answersArray),
                    event_start: unix_timestamp,
                    event_whitelist: JSON.stringify(whitelistArray)
                },
                {
                    params: {
                        api_key: process.env.NEXT_PUBLIC_LORE_EVENTS_SERVICE_API_KEY,
                        token: "sdfsfrfsvefwecewfewfefewfefewfefe"
                    }
                }
            )
            .then(result => {
                console.log(result);
                setLoading(false);
                setErrorMessage(result.data.message);
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
        }
    }
    
    return (
        <MDBContainer 
            style={{
                width: "100vw !important",
                height:"800px", position:"relative", margin: "auto",
                backgroundImage: "url("+ bg +")"
            }}
        >            
            <div 
                style={{
                    position: "absolute",
                    top:"50%", left:"50%",
                    transform: "translate(-50%,-50%)"
                }}
            >
                
                <form className="signUpForm" onSubmit={handleSubmit}
                    style = {{
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center"
                    }}
                >
                        <h2 style={{color:"#680de4"}} className="text-center"><b>Create Experience</b></h2>
                        <input 
                            className="form-control"
                            id="eventName" 
                            type="text"
                            placeholder="Event Name" 
                            style={{
                                backgroundColor: "transparent",
                                borderColor: "#680de4", 
                                borderWidth:"2px", 
                                width:"400px"
                            }}
                            required
                        />
                        <br/>

                        <input 
                            className="form-control"
                            id="eventDesc" 
                            type="text"
                            placeholder="Event Description" 
                            style={{
                                backgroundColor: "transparent",
                                borderColor: "#680de4", 
                                borderWidth:"2px", 
                                width:"400px"
                            }}
                            // onChange={handlePasswordChange}
                            required
                        />
                        <br/>
   
                        <Datetime  
                            isValidDate={valid} 
                            input={true} 
                            inputProps={inputProps} 
                            onChange={handleTimeChange}
                            onClose={handleTimeChange}
                        />
                        <br/>
                            
                        <div>
                            <label className="" style={{color:"#680de4", float:"left"}} htmlFor="royalty">
                                <b>Capacity: {rangeValue} participants</b>
                            </label>
                            <input className={styles.slider} id="capacity" type="range" 
                                min={0} max={100}
                                onChange={(e) => {
                                    setRangeValue(e.target.value);
                                }} 
                            />
                        </div>
                        <br/>
                        
                        <MDBRow>
                            <MDBCol>
                                <a onClick={()=>{openAddQuestion()}}>
                                    <h4 className="text-left" style={{color:"#680de4"}}>
                                        <MDBIcon far icon="plus-square" /> <b>Add Question</b> {/*<h5 style={{float:"right"}}>{questionCount>0 && <>{questionCount} questions added</>}</h5>*/}
                                    </h4>
                                </a>
                            </MDBCol>
                            <MDBCol>
                                <a className="button rounded" onClick={()=>{openAddNftGate()}}>
                                    <h4 className="text-left" style={{color:"#680de4"}}>
                                        <MDBIcon far icon="plus-square" /> <b>NFT Gate</b>
                                    </h4>
                                </a>
                            </MDBCol>
                        </MDBRow>


                        {
                            addQuestion
                            &&
                            <div style={{marginTop:"0px !important"}} className="text-center py-4 mt-3 border rounded">
                                <input 
                                    className="form-control"
                                    type="text"
                                    placeholder="Question" 
                                    style={{
                                        backgroundColor: "transparent",
                                        borderColor: "#680de4", 
                                        borderWidth:"2px",
                                        maxWidth:"385px",
                                        margin:"5px"
                                    }}
                                    onChange={handleQuestionChange}
                                    required
                                />
                                <br/>                      
                                <input 
                                    className="form-control"
                                    type="text" 
                                    placeholder="Answer" 
                                    style={{
                                        backgroundColor: "transparent",
                                        borderColor: "#680de4", 
                                        borderWidth:"2px", 
                                        maxWidth:"385px",
                                        margin:"5px"
                                    }}
                                    onChange={handleAnswerChange}
                                />
                                <br/>                      
                                <input 
                                    className="form-control"
                                    type="text" 
                                    placeholder="Time Code" 
                                    style={{
                                        backgroundColor: "transparent",
                                        borderColor: "#680de4", 
                                        borderWidth:"2px",
                                        maxWidth:"385px",
                                        margin:"5px"
                                    }}
                                    onChange={handleTimeCodeChange}
                                />
                                <br/>
                                <button 
                                    className="btn rounded text-white" 
                                    style={{
                                        backgroundColor: "#680de4", width:"385px", margin:"0px"
                                    }}
                                    onClick={()=>{handleAddQuestion()}}
                                >
                                    <b>Add Question</b>
                                </button>
                            </div>
                        }
                        <br/>

                        {
                            addNFT
                            &&
                            <div style={{marginTop:"0px !important"}} className="text-center py-4 mt-3 border rounded">
                                <input 
                                    className="form-control"
                                    type="text"
                                    placeholder="Collection" 
                                    style={{
                                        backgroundColor: "transparent",
                                        borderColor: "#680de4", 
                                        borderWidth:"2px",
                                        maxWidth:"385px",
                                        margin:"5px"
                                    }}
                                    onChange={handleNftChange}
                                    required
                                />
                                <br/>                      
                                
                                <button 
                                    className="btn rounded text-white" 
                                    style={{
                                        backgroundColor: "#680de4", width:"385px", margin:"0px"
                                    }}
                                    onClick={()=>{handleAddNftGate()}}
                                >
                                    <b>Add NFT</b>
                                </button>
                            </div>
                        }
                        {/* <br/> */}

                        {/* <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroupFileAddon01">
                                Upload
                                </span>
                            </div>
                            <div className="custom-file">
                                <input
                                type="file"
                                className="custom-file-input"
                                id="inputGroupFile01"
                                aria-describedby="inputGroupFileAddon01"
                                />
                                <label className="custom-file-label" htmlFor="inputGroupFile01">
                                Choose file
                                </label>
                            </div>
                        </div> */}
                        {/*  style={{backgroundColor:"#680de4"}}   button rounded*/}
                        <div className="">
                            <div className="">
                                {/* <div className={styles.file-select-button} id="fileName">Choose File</div>
                                <div className={styles.file-select-name} id="noFile">No file chosen...</div>  */}
                                <input 
                                    className="" 
                                    onChange={(e) => handleFiles(e.target.files)}  
                                    style={{width:"400px"}}
                                    type="file" 
                                    name="chooseFile" 
                                    id="chooseFile"  
                                />
                            </div>
                        </div>
                        <br/>
                        
                        {
                            loading
                            ?
                                <LoadingSpinner/>
                            :
                                <button 
                                    className="btn rounded text-white" 
                                    style={{
                                        backgroundColor: "#680de4", width:"400px", margin:"0px"
                                    }}
                                    disabled={disabledSubmit}
                                >
                                    <b>Create Event</b>
                                </button>
                        }
 
                        <br/>
                        <p style={{color:"#680de4", maxWidth: "400px"}}>{errorMessage}</p>
                </form>
            </div>
        </MDBContainer>
    )
}

export default CreateEvent;