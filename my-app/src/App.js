import { render } from '@testing-library/react';
import React from 'react';
import './style/App.css';
import {InfoContainer} from './Info';
import {DanmukuPlayer} from './DanmukuPlayer'

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='App'>
        <h1>Hello world!</h1>
        <h2>This is the app</h2>
        <DanmukuPlayer 
            danmukuOpacity={1}
            danmukuRelativeSpeed={1}
            danmukuDuration={12}
        />
        {/* <InfoContainer /> */}
      </div>
    );
  }
}

export default App;
