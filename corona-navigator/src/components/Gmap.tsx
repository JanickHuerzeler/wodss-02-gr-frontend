import React, {Component} from "react";
import "../scss/Gmap.scss";
import {injectIntl, WrappedComponentProps} from "react-intl";
import InfoBubble from "./InfoBubble";
import {areLocationArraysEqual, areLocationsEqual} from "../helpers/AreLocationsEqual";
import {removeMarker, removePolygons, removeRoute} from "../helpers/MapInteractions";
import {DefaultApi} from "../api/api";
import {Configuration, CoordinateDTO, MunicipalityDTO} from "../api";
import {HiCheckCircle, ImSpinner2} from "react-icons/all";
import {RouteInfos} from "../types/RouteInfos";
import {GmapProps, GmapState} from "../types/Gmap";
import GoogleMapReact, {Coords} from "google-map-react";
import axios from "axios";

const DefaultApiConfig              = new Configuration({basePath: process.env.REACT_APP_SERVER_URL});

// Request Cancelation ideas from: 
// https://julietonyekaoha.medium.com/react-cancel-all-axios-request-in-componentwillunmount-e5b2c978c071
// https://medium.com/tribalscale/how-to-automate-api-code-generation-openapi-swagger-and-boost-productivity-1176a0056d8a
// const source                        = axios.CancelToken.source();
// const axiosInstance                 = axios.create({cancelToken: source.token});
// const API                           = new DefaultApi(DefaultApiConfig, DefaultApiConfig.basePath, axiosInstance);

const API                           = new DefaultApi(DefaultApiConfig);
const GOOGLE_API_KEY                = process.env.REACT_APP_GOOGLE_API_KEY!;
const DEFAULT_MAP_CENTER            = { lat: Number.parseFloat(process.env.REACT_APP_DEFAULT_MAP_CENTER_LAT!), 
                                        lng: Number.parseFloat(process.env.REACT_APP_DEFAULT_MAP_CENTER_LNG!) };
const MAP_OPTIONS                   = () => { return {styles: [{stylers: [{'saturation': -99}, {'gamma': .8}, {'lightness': 5}]}]}};
const POLY_OPTIONS                  = { strokeOpacity: .5,  fillOpacity: .3 };
const POLY_OPTIONS_HOVER            = { strokeOpacity: .95, fillOpacity: .6 };
const WAYPOINT_DISTANCER_CHUNKER    = Number.parseInt(process.env.REACT_APP_WAYPOINT_DISTANCE_CHUNKER!);

/**
 * Display a google map and provide all necessary interactions with the map.
 */
class GoogleMaps extends Component<GmapProps & WrappedComponentProps, GmapState> {
    private readonly directionsService:         any;
    private readonly directionsRenderer:        google.maps.DirectionsRenderer;
    private readonly mapPolygons:               google.maps.Polygon[];
    private          locationMarker:            google.maps.Marker | undefined;
    private          locationFromBefore:        Coords | undefined;
    private          locationToBefore:          Coords | undefined;
    private          locationStopOversBefore:   Coords[] | undefined;
    private          travelModeBefore:          google.maps.TravelMode;

    // set default state
    state: GmapState = {
        defaultCenter:   DEFAULT_MAP_CENTER,
        center:          DEFAULT_MAP_CENTER,
        defaultZoom:     12,
        map:             null,
        mapLoaded:       false,
        isLoading:       false,
        loaded:          false,
        uniqueId:        0,
        infoBubble: {
            show:        false,
            lat:         '',
            lng:         '',
            name:        '',
            zip:         0,
            incidence:   0
        }
    }

    constructor(props: (GmapProps & WrappedComponentProps)) {
        super(props);

        this.directionsService          = new google.maps.DirectionsService();
        this.directionsRenderer         = new google.maps.DirectionsRenderer();
        this.mapPolygons                = [];
        this.locationMarker             = undefined;
        this.locationFromBefore         = this.props.locationFrom;
        this.locationToBefore           = this.props.locationTo;
        this.locationStopOversBefore    = this.props.locationStopOvers;
        this.travelModeBefore           = this.props.travelMode;
    }

    /**
     * send a rest call with waypoints to the backend and get a list of municipalities along the route back.
     * @param {CoordinateDTO[]} waypoints - All or a chunk if waypoints along the route
     * @param {(data: MunicipalityDTO[]) => void } callback - Callback to handle the response
     */
    sendWaypointsToBackend(waypoints: CoordinateDTO[], callback: (data: MunicipalityDTO[]) => void) {
        API.waypointsPost(
            this.props.selectedLocale, 
            waypoints, 
            //{cancelToken: source.token}
            )
        // API.waypoints.municipalityList(waypoints)
            .then((response: { data: MunicipalityDTO[] }) => {
                callback(response.data);
            },(err)=>{
                console.log(err.message);
            })
            /*.catch((thrown)=>{
                if (axios.isCancel(thrown)) {
                    console.log('Request canceled', thrown.message);
                  } else {
                    // handle error
                  }
            })*/
            ;
    }

    /**
     * Insert a municipality in the correct position in the list of municipalities.
     *
     * This is necessary because there can be several asynchronous requests to the backend
     * and the order of the responses does not have to match to the order which they have been sent.
     * @param {MunicipalityDTO} m    - Municipality to add
     * @param {RouteInfos} routeInfo - Current RouteInfos
     * @param {number} chunkIndex    - Index of waypoint chunk
     */
    insertMunicipalityToRouteInfo(m: MunicipalityDTO, routeInfo: RouteInfos, chunkIndex: number) {
        let i: number;
        let insertMunicipality = true;

        // check if municipality already exist
        for(i = 0; i < routeInfo.municipalities.length; i++) {
            if(routeInfo.municipalities[i].municipality.name === m.name){
                if(routeInfo.municipalities[i].index > chunkIndex) {
                    // delete existing municipality and insert the new one
                    insertMunicipality = true;
                    routeInfo.municipalities.splice(i, 1);
                } else {
                    // a municipality exist earlier on the route -> do nothing
                    insertMunicipality = false;
                }
                break;
            }
        }

        if(insertMunicipality) {
            for(i = 0; i < routeInfo.municipalities.length; i++) {
                // insert at current position if current index is bigger
                if(chunkIndex < routeInfo.municipalities[i].index) {
                    break;
                }

                // insert at next position if next index is bigger on no next element exist
                if(chunkIndex < routeInfo.municipalities[i+1]?.index || !routeInfo.municipalities[i+1]) {
                    i++; break;
                }
            }

            // insert municipality
            routeInfo.municipalities.splice(i, 0, {
                municipality: m,
                index: chunkIndex
            });
        }
    }

    /**
     * Either calculate a route and display it or if the origin or destination is not available, set a single marker.
     *
     * In addition, a polygon with the boundaries of each municipality along the route is drawn on the map
     * and coloured according to the incidence.
     * If the municipality is hovered, an info box appears with the name of the municipality and the incidence.
     */
    handleMap = () => {
        this.directionsRenderer.setMap(this.state.map);

        // if location from and to are set, calculate and display route
        if (this.props.locationFrom && this.props.locationTo) {
            const uniqueId = Date.now();
            this.setState({ uniqueId: uniqueId });
            const stopOverWaypoints = this.props.locationStopOvers && this.props.locationStopOvers.length > 0
                ? this.props.locationStopOvers
                    .filter(s => (s.lat && s.lng)) // necessary as stopover might be empty
                    .map((s) => {return { location: s, stopover: true }})
                : undefined;

            // remove all polygons and markers
            removePolygons(this.mapPolygons);
            removeMarker(this.locationMarker);

            let directionServiceOptions: any = {
                origin:      this.props.locationFrom,
                destination: this.props.locationTo,
                travelMode:  this.props.travelMode
            }

            // travel mode "transit" only accepts two waypoints
            if(this.props.travelMode !== google.maps.TravelMode.TRANSIT){
                directionServiceOptions.waypoints = stopOverWaypoints;
            }
            // send the request to google api
            this.directionsService.route(directionServiceOptions,
            (result: any, status: any) => {
                // handle the response (route) only if it's valid
                if (result && status === google.maps.DirectionsStatus.OK) {
                    const routeInfo: RouteInfos                     = this.computeRouteInfos(result);
                    const waypoints: Coords[]                       = [];
                    const waypointsChunks: any[]                    = [];
                    const currentPolygons: (string | undefined)[]   = [];
                    let chunkSize: number;
                    this.setState({ isLoading: true });

                    // show route on map
                    this.directionsRenderer.setDirections(result);

                    // set infos (distance and duration) for sidebar
                    this.props.routeChanged(routeInfo);

                    // prepare waypoints for backend call
                    if(this.props.travelMode === google.maps.TravelMode.TRANSIT) {
                        // if travelmode is transit, get only waypoints from train stops (steps)
                        result.routes[0].legs.forEach((wps: any) => {
                            wps.steps.forEach((wp: any) => {
                                this.pushWaypoint(waypoints, wp.start_location);
                                this.pushWaypoint(waypoints, wp.end_location);
                            });
                        });
                    } else {
                        // get all waypoints from route
                        result.routes[0].overview_path.forEach((wp: any) => {
                            this.pushWaypoint(waypoints, wp);
                        });
                    }


                    // calculate a reasonable chunksize based on the length of the route
                    chunkSize = Math.ceil(waypoints.length / (Math.ceil(routeInfo.distance / WAYPOINT_DISTANCER_CHUNKER)));

                    // split waypoints-array in chunks
                    for (let i = 0, j = waypoints.length; i < j; i += chunkSize) {
                        waypointsChunks.push(waypoints.slice(i,i + chunkSize));
                    }

                    // if no waypoints exist show success message directly
                    if(waypointsChunks.length === 0) this.municipalitiesLoaded();

                    /* call backend for municipalities along the route for each waypoint-chunk */
                    waypointsChunks.forEach((wps: CoordinateDTO[], chunkIndex: number) => {
                        this.sendWaypointsToBackend(wps, data => {
                            // handle municipality polygons only if no new route has been calculated in the meantime
                            if(data && data.length > 0 && this.state.uniqueId === uniqueId) {
                                data.forEach((m: MunicipalityDTO) => {
                                    // insert municipality in the correct position in the list of municipalities
                                    this.insertMunicipalityToRouteInfo(m, routeInfo, chunkIndex);

                                    // insert municipality polygon only to map if it doesn't already exist
                                    if(!currentPolygons.includes(m.name)) {
                                        currentPolygons.push(m.name);

                                        // if geo shapes are present, iterate through all and add it to the map
                                        if (m.geo_shapes) {
                                            const bounds = new google.maps.LatLngBounds();

                                            m.geo_shapes.forEach((geo_shape: CoordinateDTO[]) => {
                                                // create new polygon
                                                const gPolygon = new google.maps.Polygon(
                                                    {
                                                        paths: geo_shape.map((coords: CoordinateDTO) => {
                                                            const pos = {
                                                                lat: coords.lat || 0,
                                                                lng: coords.lng || 0
                                                            };

                                                            bounds.extend(pos);
                                                            return pos;
                                                        }),
                                                        strokeWeight: 2,
                                                        strokeColor: m.incidence_color,
                                                        fillColor: m.incidence_color,
                                                        map: this.state.map,
                                                        ...POLY_OPTIONS
                                                    }
                                                );

                                                // mouseover listener to show info bubble
                                                gPolygon.addListener("mouseover", () => {
                                                    gPolygon.setOptions(POLY_OPTIONS_HOVER);
                                                    
                                                    this.setState({
                                                        infoBubble: {
                                                            show: true,
                                                            lat: bounds.getCenter().lat().toString(),
                                                            lng: bounds.getCenter().lng().toString(),
                                                            name: m.name,
                                                            zip: m.plz,
                                                            incidence: m.incidence
                                                        }
                                                    });
                                                });

                                                // mouseout listener to hide info bubble
                                                gPolygon.addListener("mouseout", () => {
                                                    gPolygon.setOptions(POLY_OPTIONS);

                                                    this.setState({
                                                        infoBubble: {
                                                            ...this.state.infoBubble,
                                                            show: false
                                                        }
                                                    });
                                                });

                                                // add polygon to map
                                                this.mapPolygons.push(gPolygon);
                                            });

                                            // compute incidence average, set infos for sidebar and fire a change event
                                            this.computeRouteIncidenceRollingAVG(routeInfo, m.incidence);
                                            this.props.routeChanged(routeInfo);
                                        } else {
                                            console.warn('ERROR: no geo_shapes found')
                                        }
                                    }
                                });

                                // if the last chunk is processed show success message
                                if(chunkIndex+1 === waypointsChunks.length) {
                                    // show success message
                                    this.municipalitiesLoaded();
                                }
                            }
                        });
                    });

                } else {
                    console.error(`error fetching directions ${result}`);
                }
            });
        } else {
            // set a marker if locationFrom or locationTo empty yet

            // remove route, marker and polygons
            this.props.routeChanged({distance: 0, duration: 0, incidence: null, municipalities: []});
            removeRoute(this.directionsRenderer);
            removeMarker(this.locationMarker);
            removePolygons(this.mapPolygons);

            // set the marker at the desired location
            const pos = this.props.locationFrom || this.props.locationTo;
            if (pos) {
                this.locationMarker = new google.maps.Marker({
                    position: pos,
                    map:      this.state.map,
                });

                // center the map to the marker (timeout to bypass warning message in browser)
                if (this.state.center !== pos) {
                    setTimeout(() => this.setState({ center: pos }), 0)
                }
            }
        }

    };

    /**
     * Add a waypoint to the waypoint-array from route.
     * @param {(lat: number; lng: number;)[]} waypoints        - Waypoint-array from route
     * @param {lat: () => string; lng: () => string;} waypoint - Waypoint to add
     */
    pushWaypoint(waypoints: { lat: number; lng: number; }[], waypoint: { lat: () => string; lng: () => string; }) {
        waypoints.push({
            lat: parseFloat(waypoint.lat()),
            lng: parseFloat(waypoint.lng())
        });
    }

    /**
     * Hide loading messagre and show success message for 6sec
     */
    municipalitiesLoaded() {
        this.setState({ isLoading: false });
        this.setState({ loaded: true });
        setTimeout(() => this.setState({ loaded: false }), 6000);
    }

    /**
     * Calculate the total distance and duration of the first (best) route.
     * @param {google.maps.DirectionsResult} routes - All routes returned by the google api
     */
    computeRouteInfos(routes: google.maps.DirectionsResult) {
        const route = routes.routes[0];

        // prepare RouteInfos
        let result = {
            distance:          0,
            duration:          0,
            incidence:         null,
            municipalities:    []
        };

        // if no route or route segments are found, calculate nothing and return
        if (!route || !route.legs) return result;

        // loop through all legs (sections) of a route
        route.legs.forEach((leg: any) => {
            result.distance  += leg.distance!.value;
            result.duration  += leg.duration!.value;
        });


        result.distance /= 1000; // distance in km
        result.duration /= 60;   // duration in minutes

        return result;
    }

    /**
     * Calculate the rolling average of all incidence values of the municipalities along the route.
     * It must be calculated rolling because many requests can be sent or received in any order (asynchronous).
     * @param {RouteInfos} routeInfo         - Object with route infos
     * @param {number | undefined} incidence - Incidence value to add
     */
    computeRouteIncidenceRollingAVG(routeInfo: RouteInfos, incidence: number | undefined) {
        let result = 0, numMunicipalities = 0

        // calculate the number of municipalities with a valid incidence value (>= 0)
        routeInfo.municipalities.forEach((m: { municipality: MunicipalityDTO }) => {
            if(m.municipality.incidence || m.municipality.incidence === 0) numMunicipalities++;
        });

        // If it's not the first round, calculate the new average
        if(incidence || incidence === 0) {
            // this check is for the only first round
            if(routeInfo.incidence || routeInfo.incidence === 0){
                result = (numMunicipalities - 1) * routeInfo.incidence;
                result += incidence;
                routeInfo.incidence = result / numMunicipalities;
            } else {
                routeInfo.incidence = incidence;
            }
        }
    }

    /**
     * Calculate and display only a new route if the travelmode or a location has really been changed.
     */
    componentDidUpdate() {
        if ((
                !areLocationsEqual(this.locationFromBefore, this.props.locationFrom) ||
                !areLocationsEqual(this.locationToBefore, this.props.locationTo) ||
                !areLocationArraysEqual(this.locationStopOversBefore, this.props.locationStopOvers)
            ) || this.props.travelMode !== this.travelModeBefore
        ) {

            // TODO: Discuss this. this should be the right place for cancellation of previous requests?
            // if(source) source.cancel("Timeout of 30 seconds reached.");
            
            // if a location has been changed, backup the current values
            this.locationFromBefore         = this.props.locationFrom;
            this.locationToBefore           = this.props.locationTo;
            this.locationStopOversBefore    = this.props.locationStopOvers;
            this.travelModeBefore           = this.props.travelMode;
            
            // handle the map only if it's fully loaded
            this.state.mapLoaded && this.handleMap();
        }
    }

    /**
     * Render HTMl output
     */
    render() {
        const { defaultCenter, defaultZoom, center } = this.state;
        const { intl } = this.props;

        return (
            <div className={'gmap-wrapper'}>
                {/* Show preloader whole the municipalities are loading */}
                { this.state.isLoading &&
                <div className='is-loading'>
                    <ImSpinner2 className='icon-spin' />
                    <span>{intl.formatMessage({ id: "loadingIncidenceOverlay" })}</span>
                </div>
                }

                {/* Show success message if the municipalities are loaded */}
                { this.state.loaded &&
                <div className='loading-finished'>
                    <HiCheckCircle />
                    <span>{intl.formatMessage({ id: "loadingFinished" })}</span>
                </div>
                }

                {/* Goole map component */}
                <GoogleMapReact
                    bootstrapURLKeys  = { { key: GOOGLE_API_KEY } }
                    defaultCenter     = { defaultCenter }
                    defaultZoom       = { defaultZoom }
                    center            = { center }
                    options           = { MAP_OPTIONS}
                    onGoogleApiLoaded = { ({ map }) => {
                        this.setState({
                            map:       map,
                            mapLoaded: true
                        });
                    }}
                    yesIWantToUseGoogleMapApiInternals
                >
                    {/* Only one InfoBubble for all municipalities because only one can be displayed at once. */}
                    <InfoBubble
                        lat  = { this.state.infoBubble.lat }
                        lng  = { this.state.infoBubble.lng }
                        data = { this.state.infoBubble     }
                    />
                </GoogleMapReact>
            </div>
        );
    }
}

export default injectIntl(GoogleMaps);
