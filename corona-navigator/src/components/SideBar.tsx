import React, {Component} from "react";
import axios from "axios";
import {FaBicycle, FaCar, FaGlobe, FaPlus, FaRoute, FaSubway, FaWalking} from "react-icons/fa";
import {injectIntl,FormattedMessage,WrappedComponentProps} from "react-intl";
import {ProSidebar, SidebarHeader, SidebarFooter, SidebarContent, Menu, MenuItem, SubMenu} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "../scss/SideBar.scss";
import { Helloworldtype } from "../api";
import SearchBar from "./SearchBar";
import {Button, ButtonGroup} from "react-bootstrap";
import logo from "../resources/logo.png";
import {BiTime, GiPathDistance} from "react-icons/all";

/**
 * TODO: maybe refactor into config file?
 * */
const baseApiPath    = "http://localhost:5001";
const helloWorldPath = "/helloworld/";
const headers        = {
  headers: { "Content-Type": "application/json; charset=utf-8" },
};

interface SideBarProps {
  rtl:                 boolean;
  collapsed:           boolean;
  toggled:             boolean;
  locales:             { [key: string]: string };
  localeChanged:       (locale: string) => void;
  handleToggleSidebar: (toggle: boolean) => void;
  locationFromChanged: (lat: number | null, lng: number | null) => void;
  locationToChanged:   (lat: number | null, lng: number | null) => void;
  locationStopOversChanged: (coordsArray: StopOverCoords[]) => void;
  travelModeChanged:   (travelMode: google.maps.TravelMode) => void;
  routeDistance:       number;
  routeDuration:       number;
}

interface SideBarState {
  helloWorldCoordinates: Helloworldtype[] | undefined;
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
    helloWorldCoordinates: [],
    stopOvers:             [],
    travelMode:            "DRIVING"
  }

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.handleHelloWorldChange();
  }

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

  handleHelloWorldChange() {
    axios
      .get<Helloworldtype[]>(baseApiPath + helloWorldPath, {
        headers: headers.headers,
      })
      .then((response: any) => {
        this.setState({ helloWorldCoordinates: response.data });
      })
      .catch((ex: { response: { status: number } }) => {
        const error =
          ex.response.status === 404
            ? "Resource not found"
            : "Unexpected Error";
        console.log(error);
      });
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
            <img src={logo} />
            {intl.formatMessage({ id: "sideBarTitle" })}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <Menu key='menuTravelMode'>
            <div className='travelMode'>
              <ButtonGroup aria-label="Basic example">
                <Button
                    className={(this.state.travelMode === "DRIVING") ? "active" : ""}
                    id="DRIVING" variant="secondary"
                    onClick={this.changeTravelMode}
                ><FaCar /></Button>
                <Button
                    className={(this.state.travelMode === "TRANSIT") ? "active" : ""}
                    id="TRANSIT" variant="secondary"
                    onClick={this.changeTravelMode}
                ><FaSubway /></Button>
                <Button
                    className={(this.state.travelMode === "WALKING") ? "active" : ""}
                    id="WALKING" variant="secondary"
                    onClick={this.changeTravelMode}
                ><FaWalking /></Button>
                <Button
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
                <SearchBar
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
              {/* </div> */}
              {this.state?.stopOvers?.map((stopOverCoords, index) => {
                return (<div className="search-bar-stop-over">
                  <SearchBar key={'searchBarStopOver'+index}
                    placeholder={intl.formatMessage({ id: "stopover" })}
                    onLocationChanged={(lat, lng) => {
                      this.handleStopOverChanged(lat, lng, index);
                    }}
                    focus={false}
                  ></SearchBar>
                  </div>
                );
              })}
              {/* <div className='search-bar'>
                <SearchBar
                  placeholder={intl.formatMessage({ id: "destinationFrom" })}
                  onLocationChanged={this.props.locationFromChanged}
                  focus={true}
                />
              </div> */}
            </MenuItem>
            <MenuItem key='searchBarTo'>
              <div className='search-bar'>
                <SearchBar
                  placeholder={intl.formatMessage({ id: "destinationTo" })}
                  onLocationChanged={this.props.locationToChanged}
                />
              </div>
            </MenuItem>
            { (this.props.routeDistance > 0 && this.props.routeDuration > 0) &&
              <MenuItem>
                <div className="route-infos">
                  <span>
                    <span className='icon'><BiTime /></span>
                    { (this.props.routeDuration >= 60) && `${Math.floor(this.props.routeDuration / 60)} h ` }
                    {`${this.props.routeDuration % 60} min` }
                  </span>
                  <span>
                    <span className='icon'><GiPathDistance className='icon' /></span>
                    { this.props.routeDistance.toFixed(1) } Km
                  </span>
                </div>
              </MenuItem>
            }
          </Menu>

          {false && this.state?.helloWorldCoordinates?.map((municipality, i) => {
            return (
              <Menu
                key='menuWaypoint'
                iconShape='square'
                className='route-waypoint'
              >
                <SubMenu
                  suffix={<span className='badge purple'>{i + 1}</span>}
                  title={municipality.municipality?.bfs_nr?.toString()}
                  icon={<FaRoute />}
                >
                  <MenuItem key='municipalityArea'>
                    {intl.formatMessage({ id: "area" })}:{" "}
                    {municipality.municipality?.area}
                  </MenuItem>
                  <MenuItem key='municipalityPopulation'>
                    {intl.formatMessage({ id: "population" })}:{" "}
                    {municipality.municipality?.population}
                  </MenuItem>
                  <MenuItem key='municipalityIncidence'>
                    {intl.formatMessage({ id: "incidence" })}:{" "}
                    {municipality.municipality?.incidence}
                  </MenuItem>
                  <MenuItem key='municipalityCoords' className='coords'>
                    {intl.formatMessage({ id: "coordinates" })}:{" "}
                    {municipality.polygon?.flat().map((polygon, i) => (
                      <span key={i}>{polygon.toString()}</span>
                    ))}
                  </MenuItem>
                </SubMenu>
              </Menu>
            );
          })}
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
            <FormattedMessage id={"sideBarFooter"}></FormattedMessage>
          </a>
        </SidebarFooter>
      </ProSidebar>
    );
  }
}

export default injectIntl(SideBar);
