import { useState } from "react";
import axios from "axios";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBModal, MDBModalBody, MDBModalHeader } from "mdbreact";

const ImagePartnerCard = () => {
    const [modal, setModal] = useState(false);
    const [userEmail, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Congrats you have been added to the waitlist!");

    function handleUserNameChange(e) {
        setEmail(e.target.value);
    }

    function sendEmail() {
        if (userEmail !== "") {
            const url = process.env.NEXT_PUBLIC_EMAILS_URL;
            setModal(true);
            setLoading(true);
            axios
            .post(url, {
                email: userEmail
            })
            .then(response => {
                setLoading(false);
                setMessage("Congrats you have been added to the waitlist!");
            })
            .catch(e => {
                setLoading(false);
                setMessage("We had an issue saving your email, please make sure it is valid!");
            });
        } else {
            setModal(true);
            setMessage("We had an issue saving your email, please make sure it is valid!");
        }
    }

    return (
        <MDBContainer
            style={{
                height:"100vh", width: '100%', paddingTop: "3.5em"
            }}
        >
            <br />
            <MDBRow>
                <MDBCol md="12" className="mb-4">
                    <MDBCard
                        className="card-image rounded"
                        style={{
                            backgroundImage: "url(./assets/image/bg.png)",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center center",
                            backgroundColor: "transparent",
                            height: "300px"
                        }}
                        overlay="black-slight"
                    >
                        <div className="text-left d-flex align-items-center py-5 px-4 rounded">
                            
                        </div>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            <MDBModal isOpen={modal} toggle={() => { setModal(!modal) }} centered>
                <MDBModalHeader style={{border:"none", color:"#89df52"}}>
                    <strong>Join Waitlist</strong>
                </MDBModalHeader>
                <MDBModalBody toggle={() => { setModal(!modal) }}  className="form">
                    <MDBContainer className="form">
                        <MDBRow>
                            <MDBCol md="12">
                                <p className="h5 text-center mb-4 text"> 
                                    {   
                                        loading
                                        ?
                                            <div style={{color:"#89df52"}} className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        :
                                            message
                                    }
                                </p>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </MDBModalBody>
            </MDBModal>
        </MDBContainer>
    )
}

export default ImagePartnerCard;