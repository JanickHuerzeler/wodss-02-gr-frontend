import React, { Component } from "react";
import axios from "axios";
import { FaGlobe, FaRoute } from "react-icons/fa";
import {
  injectIntl,
  FormattedMessage,
  WrappedComponentProps,
} from "react-intl";
import {
  ProSidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Helloworldtype } from "../api";
import "../scss/SideBar.scss";
import SearchBar from "./SearchBar";

/**
 * TODO: maybe refactor into config file?
 * */
const baseApiPath = "http://localhost:5001";
const helloWorldPath = "/helloworld/";
const headers = {
  headers: { "Content-Type": "application/json; charset=utf-8" },
};

interface SideBarProps {
  rtl: boolean;
  collapsed: boolean;
  toggled: boolean;
  locales: { [key: string]: string };
  localeChanged: (locale: string) => void;
  handleToggleSidebar: (toggle: boolean) => void;
  locationFromChanged: (lat: number | null, lng: number | null) => void;
  locationToChanged: (lat: number | null, lng: number | null) => void;
  locationStopOversChanged: (
    coordsArray: StopOverCoords[]
  ) => void;
}

interface SideBarState {
  helloWorldCoordinates: Helloworldtype[] | undefined;
  stopOvers: StopOverCoords[];
}

export interface StopOverCoords {
  lat: number | null;
  lng: number | null;
}

class SideBar extends Component<
  SideBarProps & WrappedComponentProps,
  SideBarState
> {
  constructor(props: any) {
    super(props);
    this.setState({ helloWorldCoordinates: [], stopOvers: [] });
  }

  componentDidMount() {
    this.handleHelloWorldChange();
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
        rtl={this.props.rtl}
        collapsed={this.props.collapsed}
        toggled={this.props.toggled}
        breakPoint='md'
        onToggle={this.props.handleToggleSidebar}
        width='380px'
      >
        <SidebarHeader>
          <div className='sidebar-header'>
            {intl.formatMessage({ id: "sideBarTitle" })}
          </div>
        </SidebarHeader>

        <SidebarContent>
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
                +
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
          </Menu>
          {this.state?.helloWorldCoordinates?.map((municipality, i) => {
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
