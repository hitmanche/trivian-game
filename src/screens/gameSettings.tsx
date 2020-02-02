import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon } from 'mdbreact';
import { FetchGet } from '../provider/service';
import { SelectBox } from 'devextreme-react';
import queryString from 'query-string'

const GameSettings: React.FunctionComponent<RouteComponentProps> = ({ history }) => {

    //KULLANICINDAN KATEGORI VE ZORLUK SEVIYESI SECILMESI SAGLANDI
    const [categoryList, setCategoryList] = useState([]);
    const difficultyList = [
        { id: 'easy', name: 'Easy' },
        { id: 'medium', name: 'Medium' },
        { id: 'hard', name: 'Hard' }
    ];

    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedDifficulty, setSelectedDifficulty] = useState('');

    //EKRAN YUKLENDIGINDE KATEGORI LISTESI CEKILIYOR
    useEffect(() => {
        FetchGet('api_token.php?command=request').then(async response => {
            var prmTokenData = await response.json();
            localStorage.setItem('token', prmTokenData.token);
            FetchGet('api_category.php').then(async catResp => {
                var prmCtg = await catResp.json();
                setCategoryList(prmCtg.trivia_categories);
            });
        });
    }, []);
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
                </MDBCol>
            </MDBRow>
            <MDBRow center>
                <MDBCol style={{ textAlign: 'center' }}>
                    <h1>Welcome To Trivian Game</h1>
                    <h4 >Please select the category and difficulty level you want to play !</h4>
                </MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol>
                    <SelectBox
                        displayExpr={'name'}
                        valueExpr={'id'}
                        dataSource={categoryList}
                        onSelectionChanged={e => {
                            setSelectedCategory(e.selectedItem.id);
                        }}
                        placeholder="Choose Category"
                    />
                </MDBCol>
                <MDBCol>
                    <SelectBox
                        displayExpr={'name'}
                        valueExpr={'id'}
                        dataSource={difficultyList}
                        onSelectionChanged={e => {
                            setSelectedDifficulty(e.selectedItem.id);
                        }}
                        placeholder="Choose Difficulty"
                    />
                </MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBBtn
                    onClick={() => {
                        var filterJson = { difficulty: '', category: 0 };
                        if (selectedDifficulty !== '') {
                            filterJson.difficulty = selectedDifficulty;
                        }
                        if (selectedCategory !== 0) {
                            filterJson.category = selectedCategory;
                        }
                        history.replace({
                            pathname: '/game',
                            search: queryString.stringify(filterJson)
                        });
                    }}
                    className="centerVariable"
                    style={{ width: '40%' }}
                    rounded
                    color="secondary">
                    <MDBIcon icon="play" size="lg" className="pr-3" />
                    PLAY
                </MDBBtn>
            </MDBRow>
        </MDBContainer>
    );
}

export default withRouter(GameSettings);