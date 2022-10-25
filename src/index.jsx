import React from 'react';
import { createRoot } from 'react-dom/client';
import Container from 'react-bootstrap/Container';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import moviesApp from './reducers/reducers';

import MainView from './components/main-view/main-view';

// Import statement to indicate that you need to bundle `./index.scss`
import './index.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
// import your icons
import { faStar as faStarFull, faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faStarHalf, faStar } from '@fortawesome/free-regular-svg-icons';

library.add(
  faStarHalf,
  faStar,
  faStarFull,
  faCircleChevronLeft
  // more icons go here
);


const store = createStore(moviesApp, devToolsEnhancer());

// Main component (will eventually use all the others)
class MyFlixApplication extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container>
          <MainView />
        </Container>
      </Provider>
    );
  }
}

// Finds the root of your app
const container = document.getElementsByClassName('app-container')[0];

// Tells React to render your app in the root DOM element
createRoot(container).render(React.createElement(MyFlixApplication));