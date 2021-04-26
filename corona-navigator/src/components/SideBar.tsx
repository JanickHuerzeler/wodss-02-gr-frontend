import React, {Component} from "react";
import {FaBicycle, FaCar, FaGlobe, FaPlus, FaSubway, FaWalking} from "react-icons/fa";
import {injectIntl,FormattedMessage,WrappedComponentProps} from "react-intl";
import {ProSidebar, SidebarHeader, SidebarFooter, SidebarContent, Menu, MenuItem} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "../scss/SideBar.scss";
import SearchBar from "./SearchBar";
import {Button, ButtonGroup} from "react-bootstrap";
import logo from "../resources/logo.png";
import {BiTime, GiPathDistance, RiVirusLine} from "react-icons/all";
import {RouteInfos} from "../App";

interface SideBarProps {
  rtl:                      boolean;
  collapsed:                boolean;
  toggled:                  boolean;
  locales:                  { [key: string]: string };
  localeChanged:            (locale: string) => void;
  handleToggleSidebar:      (toggle: boolean) => void;
  locationFromChanged:      (lat: number | null, lng: number | null) => void;
  locationToChanged:        (lat: number | null, lng: number | null) => void;
  locationStopOversChanged: (coordsArray: StopOverCoords[]) => void;
  travelModeChanged:        (travelMode: google.maps.TravelMode) => void;
  routeInfos:               RouteInfos;
}

interface SideBarState {
  stopOvers: StopOverCoords[];
  travelMode:            string;
}

export interface StopOverCoords {
  lat: number | null;
  lng: number | null;
}

class SideBar extends Component<
  SideBarProps & WrappedComponentProps,
  SideBarState
> {
  state: SideBarState = {
    stopOvers:             [],
    travelMode:            "DRIVING"
  }

  componentDidMount() { }

  changeTravelMode = (ev: any) => {
    // convert string to TravelMode enum
    const travelModeString = ev.target.id;
    const travelMode: google.maps.TravelMode =
        google.maps.TravelMode[travelModeString as keyof typeof google.maps.TravelMode];
    this.setState({
        travelMode: travelModeString
    });

    this.props.travelModeChanged(travelMode);
  }

  handleStopOverChanged = (
    lat: number | null,
    lng: number | null,
    index: number
  ) => {
    const location = !lat || !lng ? undefined : { lat: lat, lng: lng };
    const currentStopOvers = this.state.stopOvers;
    currentStopOvers[index] = location ? location : {lat: null, lng: null};
    this.setState({stopOvers: currentStopOvers});
    this.props.locationStopOversChanged(currentStopOvers);
  };

  handleAddSearchbar = () => {
    const currentStopOvers = this.state?.stopOvers ? this.state.stopOvers : [];
    this.setState({
      stopOvers: [...currentStopOvers, { lat: null, lng: null }],
    });
  };
  render() {
    const { intl } = this.props;
    return (
      <ProSidebar
        rtl        = {this.props.rtl}
        collapsed  = {this.props.collapsed}
        toggled    = {this.props.toggled}
        breakPoint = 'md'
        onToggle   = {this.props.handleToggleSidebar}
      >
        <SidebarHeader>
          <div className='sidebar-header'>
            <img src={logo} alt="Corona Navigator GR" />
            {intl.formatMessage({ id: "sideBarTitle" })}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <Menu key='menuTravelMode'>
            <div className='travelMode'>
              <ButtonGroup aria-label="Basic example">
                <Button tabIndex={1}
                    className={(this.state.travelMode === "DRIVING") ? "active" : ""}
                    id="DRIVING" variant="secondary"
                    onClick={this.changeTravelMode}
                ><FaCar /></Button>
                <Button tabIndex={2}
                    className={(this.state.travelMode === "TRANSIT") ? "active" : ""}
                    id="TRANSIT" variant="secondary"
                    onClick={this.changeTravelMode}
                ><FaSubway /></Button>
                <Button tabIndex={3}
                    className={(this.state.travelMode === "WALKING") ? "active" : ""}
                    id="WALKING" variant="secondary"
                    onClick={this.changeTravelMode}
                ><FaWalking /></Button>
                <Button tabIndex={4}
                    className={(this.state.travelMode === "BICYCLING") ? "active" : ""}
                    id="BICYCLING" variant="secondary"
                    onClick={this.changeTravelMode}
                ><FaBicycle /></Button>
              </ButtonGroup>
            </div>
          </Menu>

          <Menu key='menuSearch' iconShape='circle'>
            <MenuItem key='searchBarFrom'>
              <div className='search-bar'>
                <SearchBar tabIndex={5}
                  placeholder={intl.formatMessage({ id: "destinationFrom" })}
                  onLocationChanged={this.props.locationFromChanged}
                  focus={true}
                />
              </div>
            </MenuItem>
            <MenuItem key='searchBarAddStopover' className='searchbar-add-stop-over-wrapper'>
              {/* <div className="addStopover"> */}
              <button
                className='btn btn-purple'
                onClick={this.handleAddSearchbar}
              >
                <FaPlus />
              </button>
              {this.state?.stopOvers?.map((stopOverCoords, index) => {
                return (<div className="search-bar-stop-over">
                  <SearchBar key={'searchBarStopOver'+index}
                    placeholder={intl.formatMessage({ id: "stopover" })}
                    onLocationChanged={(lat, lng) => {
                      this.handleStopOverChanged(lat, lng, index);
                    }}
                    focus={false}
                  />
                  </div>
                );
              })}
            </MenuItem>
            <MenuItem key='searchBarTo'>
              <div className='search-bar'>
                <SearchBar tabIndex={6}
                  placeholder={intl.formatMessage({ id: "destinationTo" })}
                  onLocationChanged={this.props.locationToChanged}
                />
              </div>
            </MenuItem>
            { (this.props.routeInfos.distance > 0) &&
              <MenuItem>
                <div className="route-infos">
                  <span>
                    <span className='icon average'><RiVirusLine /></span>
                    { this.props.routeInfos?.incidence?.toFixed(1) || 0 }
                  </span>
                  <span>
                    <span className='icon'><BiTime /></span>
                    {
                      (this.props.routeInfos.duration >= 60) &&
                      `${Math.floor(this.props.routeInfos.duration / 60)} h `
                    }
                    {`${(this.props.routeInfos.duration % 60).toFixed()} min` }
                  </span>
                  <span>
                    <span className='icon'><GiPathDistance /></span>
                    { this.props.routeInfos.distance.toFixed(1) } km
                  </span>
                </div>
              </MenuItem>
            }
          </Menu>

          {(this.props.routeInfos.distance > 0) &&
            <Menu key='menuWaypoint' className="menu-waypoints">
              <div className='route-waypoints'>
                <span className="title">Gemeinden auf der Route ({this.props.routeInfos.municipalities.length})</span>
                <ul>
                  {this.props.routeInfos.municipalities.map((m, i) => {
                    return (
                      <li key={`waypoint-${i}`}>
                        <div className="bullet" style={
                          (m.municipality.incidence_color !== "#000000") ? {background: `${m.municipality.incidence_color}`}
                          : {background: `#6475b1`}
                        }/>
                        <div className="incidence">
                          { (m.municipality.incidence || m.municipality.incidence === 0)
                              ? m.municipality.incidence?.toFixed(1) : '?'
                          }
                        </div>
                        <div className="info">
                          {m.municipality.name}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Menu>
          }
        </SidebarContent>

        <SidebarFooter className='sidebar-footer'>
          <div className='localization-wrapper'>
            <FaGlobe />
            <select
              className='locales-select'
              onChange={(e) => {
                this.props.localeChanged(e.target.value);
              }}
            >
              {Object.keys(this.props.locales).map((key: string) => {
                return (
                  <option value={key} key={key}>
                    {this.props.locales[key]}
                  </option>
                );
              })}
            </select>
          </div>
          <a
            href='https://corona-navigator.ch'
            target='_blank'
            className='team-link'
            rel='noopener noreferrer'
          >
            <FormattedMessage id={"sideBarFooter"} />
          </a>
        </SidebarFooter>
      </ProSidebar>
    );
  }
}

export default injectIntl(SideBar);
