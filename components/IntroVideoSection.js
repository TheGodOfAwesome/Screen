import { MDBAnimation, MDBContainer, MDBRow, MDBCol, MDBIcon } from "mdbreact";
import ReactPlayer from 'react-player'

const IntroVideoSection = () => {
    return (
        <MDBContainer
            style={{ height:"100vh", width: '100vw', paddingTop: '3.5em'}}
        >
            <header>
                <div className="view">
                    <MDBRow>
                        <MDBCol md='6' className='text-center text-md-left mt-xl-5 mb-5'>
                            <MDBAnimation type='fadeInLeft' delay='.3s'>
                                <h1 className='h1-responsive font-weight-bold mt-sm-5'>
                                    Unlock exclusive courses, start learning and earning.
                                </h1>
                                <hr className='hr-light' />
                                <h6 className='mb-4'>
                                    <strong>
                                        Mint Condition helps creators mint exclusive courses and tutorials as <strong style={{color: "#7cb739"}}>NFTS </strong> 
                                        and allows collectors to learn, and then earn with the creators through a vibrant resale ecosystem built on the Blockchain.
                                    </strong>   
                                </h6>
                                <a href="#waitlist" className="btn rounded" style={{backgroundColor: "#89df52 !important", color:"white", outline: 0}}>Join Our Waitlist</a>
                                <a href="https://discord.gg/DyXg9AHX" className="btn rounded" style={{backgroundColor: "#89df52 !important", color:"white", outline: 0}}><MDBIcon fab icon="discord"/> Join Our Discord</a>
                            </MDBAnimation>
                        </MDBCol>

                        <MDBCol md='6' xl='5' className='text-center'>
                            <MDBAnimation type='fadeInRight' delay='.3s'>
                                <MDBRow>
                                    <MDBCol className="d-flex justify-content-center align-items-center" md='6' style={{paddingTop: "1em !important"}}>
                                            <ReactPlayer
                                                className='react-player'
                                                url="./assets/video/lore.mp4"
                                                loop={true}
                                                muted
                                                width='200px'
                                                height='200px'
                                                playing={true}
                                                style={{
                                                    borderRadius: "2.5rem",
                                                    overflow: "hidden",
                                                    maxHeight:"200px",
                                                    float: "centre"
                                                }}
                                            />
                                    </MDBCol>
                                    <MDBCol md='6' style={{paddingTop: "1em !important"}}>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol md='6' style={{paddingTop: "1em !important"}}>
                                    </MDBCol>
                                    <MDBCol className="d-flex justify-content-center align-items-center" md='6' style={{paddingTop: "1em !important"}}>
                                        <div style={{paddingTop:"1em"}}></div>
                                        <ReactPlayer
                                            className='react-player'
                                            url="./assets/video/road.mp4"
                                            loop={true}
                                            width='200px'
                                            height='200px'
                                            playing={true}
                                            style={{
                                                borderRadius: "2.5rem",
                                                overflow: "hidden",
                                                maxHeight:"200px",
                                            }}
                                            muted
                                        />
                                    </MDBCol>
                                </MDBRow>
                            </MDBAnimation>
                        </MDBCol>
                    </MDBRow>
                </div>
            </header>
        </MDBContainer>
    )
}

export default IntroVideoSection