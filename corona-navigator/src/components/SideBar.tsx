import React, { ChangeEvent, Component } from "react";
import "react-pro-sidebar/dist/css/styles.css";
import "../scss/SideBar.scss";
import {
  FaBicycle,
  FaCar,
  FaGlobe,
  FaMinus,
  FaPlus,
  FaSubway,
  FaWalking,
} from "react-icons/fa";
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
} from "react-pro-sidebar";
import { Button, ButtonGroup } from "react-bootstrap";
import { BiTime, GiPathDistance, RiVirusLine } from "react-icons/all";
import { SideBarProps, SideBarState } from "../types/SideBar";
import SearchBar from "./SearchBar";
import logo from "../resources/logo.png";
import { MunicipalityDTO } from "../api";

/**
 * Show the sidebar which mainly serves as a controller for the map.
 */
class SideBar extends Component<
  SideBarProps & WrappedComponentProps,
  SideBarState
> {
  // set default state
  state: SideBarState = {
    stopOvers: [],
    travelMode: "DRIVING",
    routeListMaxHeight: 300,
  };

  // componentDidMount() {
  //   this.updateDimensions();
  //   window.addEventListener("resize", this.updateDimensions);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener("resize", this.updateDimensions);
  // }

  // updateDimensions = () => {
  //   console.log('----------');
  //   const sideBarContentHeight = document.body.offsetHeight;
  //   const sideBarHeaderHeight = document.getElementById('sidebarHeaderWrapper')!.offsetHeight;
  //   const sideBarSearchHeight = document.getElementById('sidebarSearchWrapper')!.offsetHeight;
  //   const sideBarModeHeight = document.getElementById('sidebarModeWrapper')!.offsetHeight;
  //   const sideBarFooterHeight = document.getElementById('sidebarFooterWrapper')!.offsetHeight;
  //   console.log(sideBarContentHeight, sideBarSearchHeight, sideBarModeHeight);
  //   let sideBarListHeight = sideBarContentHeight - sideBarSearchHeight - sideBarModeHeight - sideBarHeaderHeight - sideBarFooterHeight;
  //   if(Number.isNaN(sideBarListHeight)){sideBarListHeight = 200};
  //   console.log(sideBarListHeight);
  //   this.setState({ routeListMaxHeight : sideBarListHeight});
  // };
  /**
   * Convert a string to a real travelMode-enum
   * @param {any} event - Mouse click event
   */
  changeTravelMode = (event: any) => {
    const travelModeString = event.target.id;

    // set state and fire change event
    this.setState({ travelMode: travelModeString });
    this.props.travelModeChanged(
      google.maps.TravelMode[
        travelModeString as keyof typeof google.maps.TravelMode
      ]
    );
  };

  /**
   * Handle when an stopover coordiante has been changed
   * @param {number | null} lat - Latitude of stopover coordinates.
   * @param {number | null} lng - Longitude of stopover coordinates.
   * @param { number } index    - Index of stopover in stopOvers-state.
   */
  handleStopOverChanged = (
    lat: number | null,
    lng: number | null,
    index: number
  ) => {
    const location = !lat || !lng ? undefined : { lat: lat, lng: lng };
    const currentStopOvers = this.state.stopOvers;
    currentStopOvers[index] = location || { lat: undefined, lng: undefined };
    // set state and fire change event
    this.setState(
      (state: SideBarState, props: SideBarProps) => ({
        stopOvers: currentStopOvers,
      }),
      () => {
        this.props.locationStopOversChanged(this.state.stopOvers);
      }
    );
  };

  /**
   * Add a new searchbar (input field) to the search mask
   */
  handleAddSearchbar = () => {
    const currentStopOvers = this.state.stopOvers ? this.state.stopOvers : [];

    currentStopOvers.push({ lat: undefined, lng: undefined });
    this.setState((state: SideBarState, props: SideBarProps) => ({
      stopOvers: currentStopOvers,
      // stopOvers: [...currentStopOvers, { lat: undefined, lng: undefined }],
    }));
  };

  /**
   * Remove the selected searchbar (input field) from the search mask
   * @param {number }index - index of dynamicaly added searchbar
   */
  handleRemoveSearchbar = (index: number): void => {
    let currentStopOvers = this.state.stopOvers;
    if (currentStopOvers.length > 1) {
      currentStopOvers.splice(index, 1);
    } else {
      currentStopOvers = [];
    }

    // set state and fire change event
    this.setState(
      (state: SideBarState, props: SideBarProps) => ({
        stopOvers: currentStopOvers,
      }),
      () => {
        this.props.locationStopOversChanged(this.state.stopOvers);
      }
    );
  };

  /**
   * Set the municipality for the incidence chart component
   * @param {MunicipalityDTO} municipality - selected municipality to display incidence chart for
   */
  handleRouteInfoMunicipalityClick = (municipality: MunicipalityDTO) => {
    this.props.selectedMunicipalityChanged(municipality);
  };
  

  /**
   * Render HTMl output
   */
  render() {
    const { intl } = this.props;
    return (
      <ProSidebar
        rtl={this.props.rtl}
        collapsed={this.props.collapsed}
        toggled={this.props.toggled}
        breakPoint='md'
        onToggle={this.props.handleToggleSidebar}
        data-testid='sidebar-1'
      >
        {/* Header with logo and app title */}
        <SidebarHeader id='sidebarHeaderWrapper'>
          <div className='sidebar-header'>
            <img
              className='sidebar-header-icon'
              src={logo}
              alt='Corona Navigator GR'
            />
            {intl.formatMessage({ id: "sideBarTitle" })}
          </div>
        </SidebarHeader>

        {/* Content with searchfields, stopovers, and route municipalities list */}
        <SidebarContent>
          {/* Change travelmode */}
          <Menu
            key='menuTravelMode'
            className='travelModeMenu'
            id='sidebarModeWrapper'
          >
            <div className='travelMode'>
              <ButtonGroup aria-label='Basic example'>
                <Button
                  title={intl.formatMessage({ id: "tavelModeDriving" })}
                  tabIndex={1}
                  className={
                    this.state.travelMode === "DRIVING" ? "active" : ""
                  }
                  id='DRIVING'
                  variant='secondary'
                  onClick={this.changeTravelMode}
                >
                  <FaCar />
                </Button>
                <Button
                  title={intl.formatMessage({ id: "tavelModeTransit" })}
                  tabIndex={2}
                  className={
                    this.state.travelMode === "TRANSIT" ? "active" : ""
                  }
                  id='TRANSIT'
                  variant='secondary'
                  onClick={this.changeTravelMode}
                >
                  <FaSubway />
                </Button>
                <Button
                  title={intl.formatMessage({ id: "tavelModeWalking" })}
                  tabIndex={3}
                  className={
                    this.state.travelMode === "WALKING" ? "active" : ""
                  }
                  id='WALKING'
                  variant='secondary'
                  onClick={this.changeTravelMode}
                >
                  <FaWalking />
                </Button>
                <Button
                  title={intl.formatMessage({ id: "tavelModeBicycling" })}
                  tabIndex={4}
                  className={
                    this.state.travelMode === "BICYCLING" ? "active" : ""
                  }
                  id='BICYCLING'
                  variant='secondary'
                  onClick={this.changeTravelMode}
                >
                  <FaBicycle />
                </Button>
              </ButtonGroup>
            </div>
          </Menu>

          {/* Searchfields "from" */}
          <Menu
            key='menuSearch'
            iconShape='circle'
            id='sidebarSearchWrapper'
            className='searchbar-add-stop-over-wrapper pro-menu-searchbar sidebarSearchWrapper'
          >
            <MenuItem key='searchBarFromMenuItem'>
              <div className='search-bar-stop-over searchBarFrom'>
                <div className='search-bar'>
                  <SearchBar
                    key='searchBarFrom'
                    tabIndex={5}
                    placeholder={intl.formatMessage({ id: "destinationFrom" })}
                    onLocationChanged={this.props.locationFromChanged}
                    focus={true}
                  />
                </div>
                {/* Add stopover */}
              </div>
              <button
                hidden={
                  this.state.travelMode === google.maps.TravelMode.TRANSIT
                }
                className='btn btn-purple btn-add-stopover'
                onClick={this.handleAddSearchbar}
                title={intl.formatMessage({ id: "addStopOver" })}
              >
                <FaPlus className='addStopOverIcon' />{" "}
                {intl.formatMessage({ id: "addStopOver" })}
              </button>
            </MenuItem>

            <MenuItem
              key='searchBarAddStopover'
              className='searchbar-add-stop-over-wrapper pro-menu-searchbar '
            >
              {/* Show all stopovers */}
              { this.state?.stopOvers?.map((stopOverCoords, index) => {
                  return (
                    <div hidden={
                      this.state.travelMode === google.maps.TravelMode.TRANSIT
                    }
                      className='search-bar-stop-over'
                      key={"searchBarStopOver" + index}
                    >
                      <div className='removeButtonWrapper removableSearchbar'>
                        <SearchBar
                          tabIndex={5 + (this.state?.stopOvers?.length || 0)}
                          placeholder={intl.formatMessage({ id: "stopover" })}
                          onLocationChanged={(lat, lng) => {
                            this.handleStopOverChanged(lat, lng, index);
                          }}
                          focus={false}
                        />
                      </div>
                      <button
                        className='btn btn-purple removeStopOverButton'
                        onClick={() => {
                          this.handleRemoveSearchbar(index);
                        }}
                        title={intl.formatMessage({ id: "removeStopOver" })}
                      >
                        <FaMinus />
                      </button>
                    </div>
                  );
                })}
            </MenuItem>

            {/* Searchfield "to" */}
            <MenuItem key='searchBarTo' className='pro-menu-searchbar'>
              <div className='search-bar searchBarTo'>
                <SearchBar
                  tabIndex={6 + (this.state?.stopOvers?.length || 0)}
                  placeholder={intl.formatMessage({ id: "destinationTo" })}
                  onLocationChanged={this.props.locationToChanged}
                />
              </div>
            </MenuItem>
            {/* Route result short infos (incidence avg, distance, duration) */}
            {this.props.routeInfos.distance > 0 && (
              <MenuItem key='routeInfos'>
                <div className='route-infos'>
                  <span
                    title={intl.formatMessage({ id: "infographicIncidence" })}
                  >
                    <span className='icon average'>
                      <RiVirusLine />
                    </span>
                    {this.props.routeInfos?.incidence?.toFixed(1) || 0}
                  </span>
                  <span
                    title={intl.formatMessage({ id: "infographicDuration" })}
                  >
                    <span className='icon'>
                      <BiTime />
                    </span>
                    {this.props.routeInfos.duration >= 60 &&
                      `${Math.floor(this.props.routeInfos.duration / 60)} h `}
                    {`${(this.props.routeInfos.duration % 60).toFixed()} min`}
                  </span>
                  <span
                    title={intl.formatMessage({ id: "infographicDistance" })}
                  >
                    <span className='icon'>
                      <GiPathDistance />
                    </span>
                    {this.props.routeInfos.distance.toFixed(1)} km
                  </span>
                </div>
              </MenuItem>
            )}
          </Menu>

          {/* Municipalities list along the with incidence and name */}
          {this.props.routeInfos.distance > 0 && (
            <Menu key='menuWaypoint' className='menu-waypoints'>
              <div className='route-waypoints'>
                {/* Title and table header */}
                <span className='title'>
                  <div>
                    {intl.formatMessage({ id: "municipalitiesAlongTheRoute" })}{" "}
                    ({this.props.routeInfos.municipalities.length})
                  </div>
                  <div className='waypoints-header'>
                    <span>{intl.formatMessage({ id: "ddincidenced14" })}</span>
                    <span>{intl.formatMessage({ id: "municipality" })}</span>
                  </div>
                </span>

                {/* Show all municipalities */}
                {/* style={{maxHeight: this.state.routeListMaxHeight, height: this.state.routeListMaxHeight, minHeight:this.state.routeListMaxHeight}} */}
                <div
                  className={
                    "listWrapper " + ("wrapper-" + this.state.stopOvers.length)
                  }
                >
                  <ul>
                    {this.props.routeInfos.municipalities.map((m, i) => {
                      return (
                        <li key={`waypoint-${i}`} 
                          onClick={() => (this.handleRouteInfoMunicipalityClick(m.municipality))}
                        >
                          <div
                            className='bullet'
                            style={
                              m.municipality.incidence_color !== "#000000"
                                ? {
                                    background: `${m.municipality.incidence_color}`,
                                  }
                                : { background: `#6475b1` }
                            }
                          />
                          <div className='incidence'>
                            {m.municipality.incidence ||
                            m.municipality.incidence === 0
                              ? m.municipality.incidence?.toFixed(1)
                              : "?"}
                          </div>
                          <div className='info'>{m.municipality.name}</div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </Menu>
          )}
        </SidebarContent>

        {/* Footer with impressum and language chooser */}
        <SidebarFooter className='sidebar-footer' id='sidebarFooterWrapper'>
          {/* Language Chooser */}
          <div className='localization-wrapper'>
            <FaGlobe />
            <select
              className='locales-select'
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                this.props.localeChanged(e.target.value)
              }
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
