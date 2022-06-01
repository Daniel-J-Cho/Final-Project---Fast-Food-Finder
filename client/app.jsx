import React from 'react';
import MainHeader from './pages/main-header';
import HomeButton from './pages/home-button';
import FavoritesButton from './pages/favorites-button';
import DropdownMenu from './pages/dropdown';
import LocationMarker from './pages/location-marker';
import { parseRoute } from './lib';
import { Wrapper } from '@googlemaps/react-wrapper';
import Map from './components/map';

const render = Status => {
  return <h1>{Status}</h1>;
};

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
        <div id="map" className="mapApp">
          <h1 className="text-center">Google Maps Demo</h1>
            <Wrapper apiKey={process.env.AIzaSyDMfLo7laptKHx8P66dENTNznUzvAj7570} render={render}>
              <Map />
            </Wrapper>
        </div>
      </div>
    </div>
    );
  }
}
