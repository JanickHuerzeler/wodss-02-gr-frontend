import React, {Component} from "react";
import axios from "axios";
import {FaBicycle, FaCar, FaGlobe, FaRoute, FaSubway, FaWalking} from "react-icons/fa";
import {injectIntl,FormattedMessage,WrappedComponentProps} from "react-intl";
import {ProSidebar, SidebarHeader, SidebarFooter, SidebarContent, Menu, MenuItem, SubMenu} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "../scss/SideBar.scss";
import { Helloworldtype } from "../api";
import SearchBar from "./SearchBar";
import {Button, ButtonGroup} from "react-bootstrap";

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
  travelModeChanged:   (travelMode: google.maps.TravelMode) => void;
}

interface SideBarState {
  helloWorldCoordinates: Helloworldtype[] | undefined;
  travelMode:            string;
}

class SideBar extends Component<
  SideBarProps & WrappedComponentProps,
  SideBarState
> {
  state: SideBarState = {
    helloWorldCoordinates: [],
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

  render() {
    const { intl } = this.props;
    return (
      <ProSidebar
        rtl        = {this.props.rtl}
        collapsed  = {this.props.collapsed}
        toggled    = {this.props.toggled}
        breakPoint = 'md'
        onToggle   = {this.props.handleToggleSidebar}
        width      = '380px'
      >
        <SidebarHeader>
          <div className='sidebar-header'>
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
            <MenuItem key='searchBarTo'>
              <div className='search-bar'>
                <SearchBar
                  placeholder={intl.formatMessage({ id: "destinationTo" })}
                  onLocationChanged={this.props.locationToChanged}
                />
              </div>
            </MenuItem>
          </Menu>

          {this.state?.helloWorldCoordinates?.map((municipality, i) => {
            return (
              <Menu key='menuWaypoint' iconShape='square' className='route-waypoint'>
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
