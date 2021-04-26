import React, { Component } from "react";
import "./scss/App.scss";
import GoogleMaps from "./components/Gmap";
import { Coords } from "google-map-react";
import SideBar from "./components/SideBar";
import "./resources/messages";
import { IntlProvider } from "react-intl";
import messages from "./resources/messages";
import {FaBars} from "react-icons/fa";
import {StopOverCoords} from './components/SideBar';
import {MunicipalityDTO} from "./api";

export interface RouteInfos {
  distance:       number;
  duration:       number;
  incidence:      number | null;
  municipalities: MunicipalityDTO[]
}

interface AppProps {}

interface AppState {
  locationFrom:      Coords | undefined;
  locationTo:        Coords | undefined;
  locationStopOvers: Coords[];
  travelMode:        google.maps.TravelMode;
  locale:            string;
  rtl:               boolean;
  toggled:           boolean;
  collapsed:         boolean;
  messages:          { [key: string]: any };
  routeInfos:        RouteInfos
}

class App extends Component<AppProps, AppState> {
  private locales: { [key: string]: string } = {
    "en-GB": "English",
    "de-DE": "Deutsch",
  };

  constructor(props: any) {
    super(props);
  }
  state: AppState = {
    locationFrom:      undefined,
    locationTo:        undefined,
    locationStopOvers: [],
    travelMode:        google.maps.TravelMode.DRIVING,
    locale:            "en-GB", //navigator.language
    messages:          messages,
    rtl:               false,
    toggled:           false,
    collapsed:         false,
    routeInfos:        {
      distance:       0,
      duration:       0,
      incidence:      null,
      municipalities: []
    }
  };

  locationFromChanged = (lat: number | null, lng: number | null) => {
    const location = !lat || !lng ? undefined : { lat: lat, lng: lng };
    this.setState({ locationFrom: location });
  };

  locationToChanged = (lat: number | null, lng: number | null) => {
    const location = !lat || !lng ? undefined : { lat: lat, lng: lng };
    this.setState({ locationTo: location });
  };

  locationStopOversChanged = (coordsArray: StopOverCoords[]) => {
    const coords: Coords[] = coordsArray.filter((el)=> el.lat !== null && el.lng !== null).map((el)=>{return {lat: el.lat!, lng: el.lng!}});
    this.setState({locationStopOvers: coords});
  };

  localeChanged = (locale: string) => {
    this.setState({ locale: locale });
  };

  travelModeChanged = (travelMode: any) => {
    this.setState({ travelMode: travelMode });
  }

  routeChanged = (routeInfos: RouteInfos) => {
    this.setState({
      routeInfos: routeInfos
    });
  };

  handleToggleSidebar = (toggled: boolean) => {
    this.setState({ toggled: toggled });
  };

  render() {
    return (
      <IntlProvider
        locale={this.state.locale}
        messages={this.state.messages[this.state.locale]}
      >
        <div
          className={`App app ${this.state.rtl ? "rtl" : ""} ${
            this.state.toggled ? "toggled" : ""
          }`}
        >
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

            <div
              className='btn-toggle'
              onClick={() => {
                this.handleToggleSidebar(true);
              }}
            >
              <FaBars />
            </div>
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
