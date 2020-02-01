import React from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon } from 'mdbreact';
import { RouteComponentProps, withRouter } from 'react-router-dom';


const Main: React.FunctionComponent<RouteComponentProps> = ({ history }) => {
    return (
        <MDBContainer>
            <MDBRow>
                <MDBCol>
                    <img
                        className="centerVariable img-fluid"
                        style={{ alignItems: 'center' }}
                        alt="millionare"
                        src={require('../images/millionare.gif')}
                    />
                    <h2 style={{ textAlign: 'center' }}>A Trivia Game</h2>
                </MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol>
                    <MDBBtn
                        onClick={() => history.push('/gameSettings')}
                        className="centerVariable"
                        style={{ width: '40%' }}
                        rounded
                        color="secondary">
                        <MDBIcon icon="play" size="lg" className="pr-3" />
                        GET STARTED
                    </MDBBtn>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default withRouter(Main);