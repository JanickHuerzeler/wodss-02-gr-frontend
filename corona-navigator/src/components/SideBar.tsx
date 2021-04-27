import React, {ChangeEvent, Component} from "react";
import "react-pro-sidebar/dist/css/styles.css";
import "../scss/SideBar.scss";
import {FaBicycle, FaCar, FaGlobe, FaPlus, FaSubway, FaWalking} from "react-icons/fa";
import {injectIntl,FormattedMessage,WrappedComponentProps} from "react-intl";
import {ProSidebar, SidebarHeader, SidebarFooter, SidebarContent, Menu, MenuItem} from "react-pro-sidebar";
import {Button, ButtonGroup} from "react-bootstrap";
import {BiTime, GiPathDistance, RiVirusLine} from "react-icons/all";
import {SideBarProps, SideBarState} from "../types/SideBar";
import SearchBar from "./SearchBar";
import logo from "../resources/logo.png";

/**
 * Show the sidebar which mainly serves as a controller for the map.
 */
class SideBar extends Component<SideBarProps & WrappedComponentProps, SideBarState> {
  // set default state
  state: SideBarState = {
    stopOvers:  [],
    travelMode: "DRIVING"
  }

  /**
   * Convert a string to a real travelMode-enum
   * @param {any} event - Mouse click event
   */
  changeTravelMode = (event: any) => {
    const travelModeString = event.target.id;

    // set state and fire change event
    this.setState({ travelMode: travelModeString });
    this.props.travelModeChanged(google.maps.TravelMode[travelModeString as keyof typeof google.maps.TravelMode]);
  }

  /**
   * Handle when an stopover coordiante has been changed
   * @param {number | null} lat - Latitude of stopover coordinates.
   * @param {number | null} lng - Longitude of stopover coordinates.
   * @param { number } index    - Index of stopover in stopOvers-state.
   */
  handleStopOverChanged = (lat: number | null, lng: number | null, index: number ) => {
    const location = !lat || !lng ? undefined : { lat: lat, lng: lng };
    const currentStopOvers  = this.state.stopOvers;
    currentStopOvers[index] = location || { lat: undefined, lng: undefined };

    // set state and fire change event
    this.setState({ stopOvers: currentStopOvers });
    this.props.locationStopOversChanged(currentStopOvers);
  };

  /**
   * Add a new searchbar (input field) to the search mask
   */
  handleAddSearchbar = () => {
    const currentStopOvers = this.state?.stopOvers ? this.state.stopOvers : [];
    this.setState({
      stopOvers: [...currentStopOvers, { lat: undefined, lng: undefined }],
    });
  };

  /**
   * Render HTMl output
   */
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
        {/* Header with logo and app title */}
        <SidebarHeader>
          <div className='sidebar-header'>
            <img src={logo} alt="Corona Navigator GR" />
            {intl.formatMessage({ id: "sideBarTitle" })}
          </div>
        </SidebarHeader>

        {/* Content with searchfields, stopovers, and route municipalities list */}
        <SidebarContent>
          {/* Change travelmode */}
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

          {/* Searchfields "from" */}
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
              {/* Add stopover */}
              <button
                className='btn btn-purple'
                onClick={this.handleAddSearchbar}
              >
                <FaPlus />
              </button>
              {/* Show all stopovers */}
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
            {/* Searchfield "to" */}
            <MenuItem key='searchBarTo'>
              <div className='search-bar'>
                <SearchBar tabIndex={6}
                  placeholder={intl.formatMessage({ id: "destinationTo" })}
                  onLocationChanged={this.props.locationToChanged}
                />
              </div>
            </MenuItem>
            {/* Route result short infos (incidence avg, distance, duration) */}
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

          {/* Municipalities list along the with incidence and name */}
          {(this.props.routeInfos.distance > 0) &&
            <Menu key='menuWaypoint' className="menu-waypoints">
              <div className='route-waypoints'>
                {/* Title and table header */}
                <span className="title">
                  <div>{intl.formatMessage({ id: "municipalitiesAlongTheRoute" })} ({this.props.routeInfos.municipalities.length})</div>
                  <div className="waypoints-header">
                    <span>{intl.formatMessage({ id: "ddincidenced14" })}</span>
                    <span>{intl.formatMessage({ id: "municipality" })}</span>
                  </div>
                </span>

                {/* Show all municipalities */}
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

        {/* Footer with impressum and language chooser */}
        <SidebarFooter className='sidebar-footer'>
          {/* Language Chooser */}
          <div className='localization-wrapper'>
            <FaGlobe />
            <select
              className='locales-select'
              onChange = { (e:ChangeEvent<HTMLSelectElement>) => this.props.localeChanged(e.target.value) }
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

          {/* Impressum */}
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
