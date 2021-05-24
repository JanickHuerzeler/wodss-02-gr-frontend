import React, {ChangeEvent, Component} from "react";
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
import {Button, ButtonGroup} from "react-bootstrap";
import {BiTime, GiPathDistance, RiVirusLine} from "react-icons/all";
import {SideBarProps, SideBarState} from "../types/SideBar";
import SearchBar from "./SearchBar";
import logo from "../resources/logo.png";
import {MunicipalityDTO} from "../api";
import {v4} from 'uuid';

/**
 * Show the sidebar which mainly serves as a controller for the map.
 */
class SideBar extends Component<
  SideBarProps & WrappedComponentProps,
  SideBarState
> {
  private sidebarElement: any;

  // set default state
  state: SideBarState = {
    stopOvers: [],
    travelMode: "DRIVING",
    routeListHeight: 0
  };

  /**
   * Calculate height for routeList
   */
  updateRouteListHeight = () => {
    const content  = this.sidebarElement.querySelector('.pro-sidebar-content').offsetHeight;
    const mode     = this.sidebarElement.querySelector('#sidebarModeWrapper').offsetHeight;
    const search   = this.sidebarElement.querySelector('#sidebarSearchWrapper').offsetHeight;
    const rlHeader = 60;

    this.setState({
      routeListHeight: content - mode - search - rlHeader
    });
  };

  /**
   * Add eventlistener for windows resize
   */
  componentDidMount = () => {
    window.addEventListener("resize", this.updateRouteListHeight);
    setTimeout(() => this.updateRouteListHeight(), 0);
  };

  /**
   * Remove eventlistener for windows resize
   */
  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateRouteListHeight);
  };

  /**
   * Convert a string to a real travelMode-enum
   * @param {any} event - Mouse click event
   */
  changeTravelMode = (event: any) => {
    const travelModeString = event.target.id;

    // set state and fire change event
    this.setState({ travelMode: travelModeString }, () => this.updateRouteListHeight());

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
    lat:  number | null,
    lng:  number | null,
    uuid: string
  ) => {

    const location =
      !lat || !lng ? undefined : { lat: lat, lng: lng, uuid: uuid };
    const currentStopOvers = this.state.stopOvers;
    // set state and fire change event
    this.setState(
      (state: SideBarState, props: SideBarProps) => ({
        stopOvers: currentStopOvers.map((stopOver) =>
          stopOver.uuid === uuid
            ? location || { lat: undefined, lng: undefined, uuid: uuid }
            : stopOver
        ),
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

    currentStopOvers.push({ lat: undefined, lng: undefined, uuid: v4() });
    this.setState({ stopOvers: currentStopOvers }, () => this.updateRouteListHeight());
  };

  /**
   * Remove the selected searchbar (input field) from the search mask
   * @param {number} index - index of dynamicaly added searchbar
   */
  handleRemoveSearchbar = (uuid: string): void => {
    let currentStopOvers = this.state.stopOvers;

    if (currentStopOvers.length > 1) {
      // currentStopOvers.splice(index, 1);
      currentStopOvers = currentStopOvers.filter(s => s.uuid !== uuid);
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
        this.updateRouteListHeight();
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
        ref={ sidebarElement => { this.sidebarElement = sidebarElement } }
        id="pro-sidebar"
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
          <div className="sidebar-disclaimer">
            {intl.formatMessage({id: 'incidenceDisclaimer'})}
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
              </div>
            </MenuItem>

            <MenuItem
              key='searchBarAddStopover'
              className='searchbar-add-stop-over-wrapper pro-menu-searchbar stop-overs-wrapper'
            >
              {/* Show all stopovers */}
              {this.state?.stopOvers?.map((stopOverCoords) => {
                return (
                  <div
                    hidden={
                      this.state.travelMode === google.maps.TravelMode.TRANSIT
                    }
                    className='search-bar-stop-over'
                    key={"searchBarStopOver" + stopOverCoords.uuid!}
                  >
                    <div className='removeButtonWrapper removableSearchbar'>
                      <SearchBar
                        tabIndex={5 + (this.state?.stopOvers?.length || 0)}
                        placeholder={intl.formatMessage({ id: "stopover" })}
                        onLocationChanged={(lat, lng) => {
                          this.handleStopOverChanged(lat, lng, stopOverCoords.uuid!);
                        }}
                        focus={false}
                      />
                    </div>
                    <button
                      className='btn btn-purple removeStopOverButton'
                      onClick={() => {
                        this.handleRemoveSearchbar(stopOverCoords.uuid!);
                      }}
                      title={intl.formatMessage({ id: "removeStopOver" })}
                    >
                      <FaMinus />
                    </button>
                  </div>
                );
              })}
              {/* Add stopover */}
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
            <MenuItem key='routeInfos' className={this.props.routeInfos.distance > 0 ? '' : 'hidden'}>
              <div className='route-infos'>
                <span
                  title={intl.formatMessage({ id: "infographicIncidence" })}
                  className='routeInfosHighLights'
                >
                  <span className='icon average'>
                    <RiVirusLine />
                  </span>
                  {this.props.routeInfos?.incidence?.toFixed(1) || 0}
                </span>
                <span
                  title={intl.formatMessage({ id: "infographicDuration" })}
                  className='routeInfosLowLights'
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
                  className='routeInfosLowLights'
                >
                  <span className='icon'>
                    <GiPathDistance />
                  </span>
                  {this.props.routeInfos.distance.toFixed(1)} km
                </span>
              </div>
            </MenuItem>
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
                <div className={"listWrapper"}
                     style={{maxHeight: this.state.routeListHeight, minHeight:this.state.routeListHeight}}>
                  <ul>
                    {this.props.routeInfos.municipalities.map((m, i) => {
                      return (
                        <li
                          key={`waypoint-${i}`}
                          onClick={() =>
                            this.handleRouteInfoMunicipalityClick(
                              m.municipality
                            )
                          }
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
                          <div className='info'>{m.municipality.plz} {m.municipality.name}</div>
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
            href={process.env.REACT_APP_PROJECT_URL}
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
