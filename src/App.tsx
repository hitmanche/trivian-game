import React from 'react';
import './App.css';
import { withRouter, Switch, Route } from 'react-router-dom';
import Main from './screens/main';
import Game from './screens/game';
import GameSettings from './screens/gameSettings';

const App = () => {
  return (
    //SAYFALAR ARASI YONLENDIRME ICIN ROUTER-DOM YAPISI KURULDU
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/gameSettings" component={GameSettings} />
      <Route path="/game" component={Game} />
    </Switch>
  );
}

export default withRouter(App);
