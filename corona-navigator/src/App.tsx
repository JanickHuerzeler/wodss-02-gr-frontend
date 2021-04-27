import React, { Component } from "react";
import "./scss/App.scss";
import GoogleMaps from "./components/Gmap";
import { Coords } from "google-map-react";
import { IntlProvider } from "react-intl";
import {FaBars} from "react-icons/fa";
import {Coordinates} from './types/Coordinates';
import {RouteInfos} from "./types/RouteInfos";
import {AppProps, AppState} from "./types/App";
import SideBar from "./components/SideBar";
import messages from "./resources/messages";

/**
 * Show the entire application with it's main component "SideBar" and "GoogleMaps".
 * It also acts as a data provider for the child components.
 *
 * SideBar    - contains the search fields, travelmode selection, municipality-incident list and the language switcher.
 * GoogleMaps - Contains the Google Maps with all map related functions.
 */
class App extends Component<AppProps, AppState> {
  private locales: { [key: string]: string } = {
    "de-DE": "Deutsch",
    "en-GB": "English",
  };

  // set default state
  state: AppState = {
    locationFrom:      undefined,
    locationTo:        undefined,
    locationStopOvers: [],
    travelMode:        google.maps.TravelMode.DRIVING,
    locale:            "de-DE",
    messages:          messages,
    rtl:               false,
    toggled:           false,
    collapsed:         false,
    routeInfos: {
      distance:        0,
      duration:        0,
      incidence:       null,
      municipalities:  []
    }
  };

  /**
   * Set state if origin coordinates has been changed.
   * @param {number | null} lat - Latitude of origin coordinates.
   * @param {number | null} lng - Longitude  of origin coordinates.
   */
  locationFromChanged = (lat: number | null, lng: number | null) => {
    const location = !lat || !lng ? undefined : { lat: lat, lng: lng };
    this.setState({ locationFrom: location });
  };

  /**
   * Set state if destination coordinates has been changed.
   * @param {number | null} lat - Latitude of destination coordinates.
   * @param {number | null} lng - Longitude  of destination coordinates.
   */
  locationToChanged = (lat: number | null, lng: number | null) => {
    const location = !lat || !lng ? undefined : { lat: lat, lng: lng };
    this.setState({ locationTo: location });
  };

  /**
   * Set state if an stopover stop has changed.
   * @param {Coordinates[]} coordsArray - Array that contains all stopover coordinates.
   */
  locationStopOversChanged = (coordsArray: Coordinates[]) => {
    const coords: Coords[] = coordsArray.filter((el) => {
      return (el.lat !== null && el.lng !== null)
    }).map((el) => {
      return { lat: el.lat!, lng: el.lng! }
    });

    this.setState({locationStopOvers: coords});
  };

  /**
   * Set state if the selected language has changed.
   * @param {string} locale - Contains the country code of the currently selected language.
   */
  localeChanged = (locale: string) => {
    this.setState({ locale: locale });
  };

  /**
   * Set state if the travelmode has been changed.
   * @param {google.maps.TravelMode} travelMode - Enum that contains the currently selected travel mode.
   *                                              (Possible value: BICYCLING, DRIVING, TRANSIT, WALKING)
   */
  travelModeChanged = (travelMode: google.maps.TravelMode) => {
    this.setState({ travelMode: travelMode });
  }

  /**
   * Set state if the route infos has been changed.
   * @param {RouteInfos} routeInfos - Contains all route infos that are needed to display in sidebar.
   */
  routeChanged = (routeInfos: RouteInfos) => {
    this.setState({ routeInfos: routeInfos });
  };

  /**
   * Set state uf the state of sidebar has been changed. This happens when the viewport becomes too small.
   * @param {boolean} toggled - Contains the currently selected state of sidebar (open or closed).
   */
  handleToggleSidebar = (toggled: boolean) => {
    this.setState({ toggled: toggled });
  };

  /**
   * Render HTMl response
   */
  render() {
    return (
    <IntlProvider
        locale={this.state.locale}
        messages={this.state.messages[this.state.locale]}
      >

        {/* Wrapper for sidebar */}
        <div className={`App app ${this.state.rtl ? "rtl" : ""} ${this.state.toggled ? "toggled" : ""}`}>
          {/* SideBar with props and callbacks */}
          <SideBar
            collapsed                = { this.state.collapsed }
            rtl                      = { this.state.rtl }
            toggled                  = { this.state.toggled }
            handleToggleSidebar      = { this.handleToggleSidebar }
            locationFromChanged      = { this.locationFromChanged }
            locationToChanged        = { this.locationToChanged }
            locationStopOversChanged = { this.locationStopOversChanged }
            travelModeChanged        = { this.travelModeChanged }
            locales                  = { this.locales }
            localeChanged            = { this.localeChanged }
            routeInfos               = { this.state.routeInfos }
          />
          <main>

            {/* Hamburger menu icon for small screens */}
            <div className='btn-toggle' onClick={() => { this.handleToggleSidebar(true); }}>
              <FaBars />
            </div>

            {/* Google Maps with props and callbacks */}
            <GoogleMaps
              locationFrom      = { this.state.locationFrom }
              locationTo        = { this.state.locationTo }
              locationStopOvers = { this.state.locationStopOvers }
              travelMode        = { this.state.travelMode }
              routeChanged      = { this.routeChanged }
            />
          </main>
        </div>
      </IntlProvider>
    );
  }
}

export default App;
