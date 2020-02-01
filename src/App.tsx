import React from 'react';
import './App.css';
import { withRouter, Switch, Route } from 'react-router-dom';
import Main from './screens/main';
import Game from './screens/game';
import GameSettings from './screens/gameSettings';

const App = () => {
  return (
    //sayfalar arası yönlendirme için router-dom yapısı kuruldu
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/gameSettings" component={GameSettings} />
      <Route path="/game" component={Game} />
    </Switch>
  );
}

export default withRouter(App);
