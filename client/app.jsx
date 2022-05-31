import React from 'react';
import MainHeader from './pages/main-header';
import HomeButton from './pages/home-button';
import FavoritesButton from './pages/favorites-button';
import DropdownMenu from './pages/dropdown';
import LocationMarker from './pages/location-marker';
import { parseRoute } from './lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  render() {
    return (
    <div className="container">
      <div className="row">
        <MainHeader />
      </div>
      <div className="row my-3">
        <div className="home-button">
          <HomeButton />
        </div>
        <div className="col-1 favorites-button">
          <FavoritesButton />
        </div>
        <div className="col-2 ms-sm-5 ms-md-5 ms-lg-4 dropdown-div">
          <DropdownMenu />
        </div>
        <div className="col d-flex justify-content-end">
          <LocationMarker />
        </div>
      </div>
      <div className="row">
        <div id="map"></div>
      </div>
    </div>
    );
  }
}
