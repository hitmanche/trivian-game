import React, { useEffect, useState } from 'react';
import { MDBContainer, MDBNavbar, MDBNavbarBrand, MDBRow, MDBCol, MDBBtn, MDBNavbarNav, MDBNavItem } from 'mdbreact';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string'
import { FetchGet } from '../provider/service';
import { useStopwatch } from './timer';
import Lottie from 'react-lottie';
import { correct, incorrect, loading, timeup, win } from '../lottie';

const Game: React.FunctionComponent<RouteComponentProps> = ({ location, history }) => {
    const questionType = {
        question: '',
        incorrect_answers: [''],
        correct_answer: ''
    };
    const joker50Type = {
        using: false,
        disabled: false,
        incorrectTwo: []
    };
    const [queryData, setQueryData] = useState('');

    //STATUS DURUMLARI Q:SORU, I:YANLIS CEVAP, C:DOGRU CEVAP, T:SURE DOLDU
    const [status, setStatus] = useState('Q');
    //KACINCI SORUDA OLDUGUNUN BILGISI
    const [questionNumber, setQuestionNumber] = useState(1);
    //OYUNDA O SORUDAN KAC PUAN ALDIGI BILGISI
    const [points, setPoints] = useState(0);
    //OYUNDAKI TOPLAM PUAN BILGISI
    const [totalPoints, setTotalPoints] = useState(0);
    //APIDEN GELEN SORUNUN DEGERLERI
    const [questionData, setQuestionData] = useState(questionType);
    //ZAMANLAMA ILE ILGILI OLAN BILGILER
    const { sn, start, pause, stop } = useStopwatch();
    //YARI YARIYA JOKER HAKKI BILGISI
    const [joker50, setJoker50] = useState(joker50Type);
    //APIDEN GELEN HTML KARAKTERLERI STRING IFADEYE CEVIRDIK
    const renderHTML = (rawHTML: string) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

    useEffect(() => {
        var searchData = queryString.parse(location.search);
        var query = '';
        if (searchData.category && searchData.category !== "0") {
            query += '&category=' + searchData.category;
        }
        query += searchData.difficulty !== '' ? '&difficulty=' + searchData.difficulty : '';
        setQueryData(query);
        QuestionRequest(query).then(res => {
            setQuestionData(res);
            start();
        });
    }, []);

    //GELEN CEVAPLARI BIRLESTIRIP SIKLARI KARISTIRDIGIMIZ YER
    function shuffleArray(array: Array<any>) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    //GELEN CEVAPLARI BIRLESTIRIP SIKLARI KARISTIRDIGIMIZ YER

    function QuestionRequest(query: string) {
        return new Promise<any>((resolve, reject) => {
            FetchGet('api.php?amount=' + questionNumber + query + '&token=' + localStorage.getItem('token')).then(async res => {
                var data = await res.json();
                if (data && data.results.length > 0) {
                    var arr = Object.assign([], data.results[0].incorrect_answers);
                    arr.push(data.results[0].correct_answer);
                    shuffleArray(arr);
                    data.results[0].incorrect_answers = arr;
                    resolve(data.results[0]);
                }
                reject(res);
            }).catch(err => reject(err));
        });
    }

    function TickAnswer(response: boolean) {
        pause();
        if (response === true) {
            setStatus('C');
            setQuestionNumber(res => res + 1);
            setPoints(sn * 10);
            setTotalPoints(point => point + (sn * 10));
        }
        else {
            setStatus('I');
        }
    }

    function NextQuestion() {
        setQuestionData(questionType);
        QuestionRequest(queryData).then(res => {
            setStatus('Q');
            setQuestionData(res);
            stop();
            start();
        })
    }
    function ClickJoker() {
        let response = Object.assign([]);
        var copyIncorrect = Object.assign([], questionData.incorrect_answers);
        shuffleArray(copyIncorrect);
        copyIncorrect.forEach(val => {
            if (val !== questionData.correct_answer) {
                if (response.length < 2) {
                    response.push(val);
                }
            }
        })
        setJoker50({
            using: true,
            disabled: true,
            incorrectTwo: response
        });
        //questionData.incorrect_answers
    }

    const RenderComponent = () => {
        if (questionNumber === 10) {
            return (
                <>
                    <MDBRow>
                        <MDBCol>
                            <Lottie
                                options={{ loop: false, autoplay: true, animationData: win }}
                                height={250}
                                width={250} />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol>
                            <h1>Congratulations You Won</h1>
                            <h4>You earned points: {points + ' pts'}</h4>
                            <h4>Total: {totalPoints + ' pts'}</h4>
                            <MDBBtn color="secondary" className="centerVariable" onClick={() => history.push('/')}>BACK TO MENU</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </>
            )
        }
        if (sn === 0) {
            return (
                <>
                    <MDBRow>
                        <MDBCol>
                            <Lottie
                                options={{ loop: false, autoplay: true, animationData: timeup }}
                                height={250}
                                width={250} />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol>
                            <h2>Time Is Up</h2>
                            <h4>You earned points: {points + ' pts'}</h4>
                            <h4>Total: {totalPoints + ' pts'}</h4>
                            <MDBBtn color="secondary" className="centerVariable" onClick={() => history.push('/')}>BACK TO MENU</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </>
            )
        }
        if (status === 'Q') {
            if (questionData.question === '') {
                return (
                    <Lottie
                        options={{ loop: false, autoplay: true, animationData: loading }}
                        height={250}
                        width={250} />
                )
            }
            else {
                let returnAnswers = [];
                returnAnswers.push(
                    <>
                        <MDBRow>
                            <MDBCol>
                                <MDBBtn
                                    color="secondary"
                                    disabled={joker50.using}
                                    onClick={ClickJoker}
                                >
                                    %50 Joker
                                </MDBBtn>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol>
                                <h3>{renderHTML(questionData.question)} </h3>
                            </MDBCol>
                        </MDBRow>
                    </>
                );
                questionData.incorrect_answers.forEach((val, ind) => {
                    returnAnswers.push(
                        <MDBRow key={ind}>
                            <MDBCol>
                                <MDBBtn
                                    color="secondary"
                                    disabled={(joker50.incorrectTwo.find(ans => ans === val) && joker50.disabled)}
                                    onClick={() => TickAnswer(val === questionData.correct_answer)}
                                    style={{ width: '100%', margin: '30px' }}
                                    className="centerVariable"
                                >
                                    {val}
                                </MDBBtn>
                            </MDBCol>
                        </MDBRow>
                    )
                });
                return returnAnswers;
            }
        }
        else if (status === 'I') {
            return (
                <>
                    <MDBRow>
                        <MDBCol>
                            <Lottie
                                options={{ loop: false, autoplay: true, animationData: incorrect }}
                                height={250}
                                width={250} />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol>
                            <h2>Incorrect</h2>
                            <h4>You earned points: {points + ' pts'}</h4>
                            <h4>Total: {totalPoints + ' pts'}</h4>
                            <MDBBtn color="secondary" className="centerVariable" onClick={() => history.push('/')}>BACK TO MENU</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </>
            );
        }
        else if (status === 'C') {
            return (
                <>
                    <MDBRow>
                        <MDBCol>
                            <Lottie
                                options={{ loop: false, autoplay: true, animationData: correct }}
                                height={250}
                                width={250} />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol>
                            <h2>Correct</h2>
                            <h4>You earned points: {points + ' pts'}</h4>
                            <h4>Total: {totalPoints + ' pts'}</h4>
                            <MDBBtn color="secondary" className="centerVariable" onClick={() => NextQuestion()}>NEXT QUESTION</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </>
            );
        }
    }

    return (
        <>
            <MDBNavbar style={{ padding: '50px' }} color="unique-color-dark" dark expand="md" >
                <MDBNavbarBrand>
                    <strong className="white-text">Question ({questionNumber} / 10)</strong>
                </MDBNavbarBrand>
                <MDBNavItem>
                    <strong className="white-text">{totalPoints + ' Points'}</strong>
                </MDBNavItem>
                <MDBNavbarNav right>
                    <MDBNavItem>
                        <strong className="white-text">Remaining Time : {sn}</strong>
                    </MDBNavItem>
                </MDBNavbarNav>
            </MDBNavbar>
            <MDBContainer style={{ marginTop: '60px' }}>
                {RenderComponent()}
            </MDBContainer>
        </>
    );
}

export default withRouter(Game);