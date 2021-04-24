import React, { Component } from "react";
import "./scss/App.scss";
import GoogleMaps from "./components/Gmap";
import { Coords } from "google-map-react";
import SideBar from "./components/SideBar";
import "./resources/messages";
import { IntlProvider } from "react-intl";
import messages from "./resources/messages";
import { FaBars } from "react-icons/fa";
interface AppProps {}

interface AppState {
  locationFrom: Coords | undefined;
  locationTo: Coords | undefined;
  locale: string;
  rtl: boolean;
  toggled: boolean;
  collapsed: boolean;
  messages: {[key:string]: any}
}

class App extends Component<AppProps, AppState> {
  private locales: {[key:string]: string} = {
    'en-GB': "English",
    'de-DE': "Deutsch",
  };

  constructor(props: any) {
    super(props);
  }
  state: AppState = {
    locationFrom: undefined,
    locationTo: undefined,
    locale: 'en-GB', //navigator.language
    messages: messages,
    rtl: false,
    toggled: false,
    collapsed: false,
  };

  locationFromChanged = (lat: number | null, lng: number | null) => {
    const location = !lat || !lng ? undefined : { lat: lat, lng: lng };
    this.setState({ locationFrom: location });
  };
  locationToChanged = (lat: number | null, lng: number | null) => {
    const location = !lat || !lng ? undefined : { lat: lat, lng: lng };
    this.setState({ locationTo: location });
  };

  localeChanged = (locale: string) =>{
    //   alert("new locale: "+ locale);
      this.setState({locale: locale});
  }

  handleToggleSidebar = (toggled: boolean) => {
    this.setState({ toggled: toggled });
  };

  render() {
    return (
      <IntlProvider locale={this.state.locale} messages={this.state.messages[this.state.locale]}>

        <div
          className={`App app ${this.state.rtl ? "rtl" : ""} ${
            this.state.toggled ? "toggled" : ""
          }`}
        >
          <SideBar
            collapsed={this.state.collapsed}
            rtl={this.state.rtl}
            toggled={this.state.toggled}
            handleToggleSidebar={this.handleToggleSidebar}
            locationFromChanged={this.locationFromChanged}
            locationToChanged={this.locationToChanged}
            locales={this.locales}
            localeChanged={this.localeChanged}
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
              locationFrom={this.state.locationFrom}
              locationTo={this.state.locationTo}
            />
          </main>
          {/* <Apitest/> */}
        </div>
      </IntlProvider>
    );
  }
}

export default App;
