// https://github.com/google-map-react/google-map-react

import React, {Component} from "react";
import GoogleMapReact, {Coords} from "google-map-react";
import "../scss/Gmap.scss";
import InfoBubble from "./InfoBubble";
import {areLocationArraysEqual, areLocationsEqual} from "../helpers/AreLocationsEqual";
import {removeMarker, removePolygons, removeRoute} from "../helpers/MapInteractions";
import { Api } from "../api/navigatorApi";
import {CoordinateDTO, MunicipalityDTO} from "../api";
import {ImSpinner2} from "react-icons/all";

const API                           = new Api({baseUrl:'http://localhost:5001'});
const GOOGLE_API_KEY                = "AIzaSyCaORgZFgOduOC08vlydCfxm5jWSmMVnV4";
const DEFAULT_MAP_CENTER            = { lat: 47.48107, lng: 8.21162 };
const MAP_OPTIONS                   = () => { return {styles: [{stylers: [{'saturation': -99}, {'gamma': .8}, {'lightness': 5}]}]}};
const POLY_OPTIONS                  = { strokeOpacity: .5,  fillOpacity: .3 };
const POLY_OPTIONS_HOVER            = { strokeOpacity: .95, fillOpacity: .6 };
const WAYPOINT_DISTANCER_CHUNKER    = 30

// Props interface
interface GmapProps {
    locationFrom:       Coords | undefined;
    locationTo:         Coords | undefined;
    locationStopOvers:  Coords[] | undefined;
    travelMode:         google.maps.TravelMode;
    routeChanged:       (distance: number, duration: number, incidence: number | null) => void;
}

// State interface
interface GmapState {
    defaultCenter:  Coords | undefined;
    center:         Coords | undefined;
    defaultZoom:    number;
    map:            any | null;
    mapLoaded:      boolean;
    isLoading:      boolean;
    infoBubble: {
        show:       boolean;
        lat:        string;
        lng:        string;
        name:       string | undefined;
        zip:        number | undefined;
        incidence:  number | undefined;
    }
}

/**
 * TODO: describe me
 */
class GoogleMaps extends Component<GmapProps, GmapState> {
    private readonly directionsService:         any;
    private readonly directionsRenderer:        any;
    private readonly mapPolygons:               any[];
    private          locationMarker:            any;
    private          locationFromBefore:        Coords | undefined;
    private          locationToBefore:          Coords | undefined;
    private          locationStopOversBefore:   Coords[] | undefined;
    private          travelModeBefore:          google.maps.TravelMode;

    // set default state
    state: GmapState = {
        defaultCenter: DEFAULT_MAP_CENTER,
        center:        DEFAULT_MAP_CENTER,
        defaultZoom:   12,
        map:           null,
        mapLoaded:     false,
        isLoading:     false,
        infoBubble: {
            show:      false,
            lat:       '',
            lng:       '',
            name:      '',
            zip:       0,
            incidence: 0
        }
    }

    constructor(props: GmapProps) {
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

    drawLinepath(waypoints: any[]) {
        return new google.maps.Polyline({
            path: waypoints,
            strokeColor: "#f45017",
            strokeOpacity: 1.0,
            strokeWeight: 5,
            map: this.state.map
        });
    }

    sendWaypointsToBackend(waypoints: CoordinateDTO[], callback: (data: any) => void) {
        API.waypoints.municipalityList(waypoints)
            .then((dt: { data: any; }) => {
                callback(dt.data);
            });
    }

    handleMap = () => {
        this.directionsRenderer.setMap(this.state.map);

        // if location from and to are set, print route
        if (this.props.locationFrom && this.props.locationTo) {
            // remove all polygons
            removePolygons(this.mapPolygons);

            const stopOverWaypoints = this.props.locationStopOvers ? this.props.locationStopOvers.map((s)=>{return {location: s, stopover: true}}) : undefined;
            // get and print  route
            this.directionsService.route({
                    origin:      this.props.locationFrom,
                    destination: this.props.locationTo,
                    waypoints:   stopOverWaypoints,
                    travelMode:  this.props.travelMode
                },
                (result: any, status: any) => {
                    if (result && status === google.maps.DirectionsStatus.OK) {
                        const routeInfo: {
                            distance:          number,
                            duration:          number,
                            incidence:         number | null,
                            numMunicipalities: number
                        } = this.computeRouteInfos(result);

                        const waypoints: any[] = [];
                        const waypointsChunks: any[] = [];
                        let chunkSize: number;
                        this.setState({ isLoading: true });
                        this.directionsRenderer.setDirections(result);

                        // set infos (sidebar)
                        this.props.routeChanged(routeInfo.distance, routeInfo.distance, 0);

                        // generate linepath for backend
                        result.routes[0].overview_path.forEach(function (wp: any) {
                            waypoints.push({
                                lat: parseFloat(wp.lat()),
                                lng: parseFloat(wp.lng())
                            });
                        });

                        // set chunk size
                        chunkSize = Math.ceil(waypoints.length / (Math.ceil(routeInfo.distance / WAYPOINT_DISTANCER_CHUNKER)));
                        console.log("Chunksize:" + chunkSize);

                        // draw linepath
                        // const linePath = this.drawLinepath(waypoints);

                        // split waypoints-array in chunks
                        for (let i = 0, j = waypoints.length; i < j; i += chunkSize) {
                            waypointsChunks.push(waypoints.slice(i,i + chunkSize));
                        }

                        /** Call backend for municipalities */
                        const currentPolygons: (string | undefined)[] = [];

                        waypointsChunks.forEach((wps: any[], index: number) => {
                            this.sendWaypointsToBackend(wps, data => {
                                // draw municipality polygons
                                if(data) {
                                    data.forEach((m: MunicipalityDTO) => {
                                        if(!currentPolygons.includes(m.name)) {
                                            currentPolygons.push(m.name);
                                            if(m.incidence || m.incidence === 0) {
                                                routeInfo.numMunicipalities++;
                                            }

                                            if (m.geo_shapes) {
                                                const bounds = new google.maps.LatLngBounds();

                                                // TODO: Iterate geo_shapes (can have multiple Polygons)
                                                const gPolygon = new google.maps.Polygon(
                                                    {
                                                        // TODO: Remove this [0] workaround (just here to not break stuff)
                                                        paths: m.geo_shapes[0].map((coords: CoordinateDTO) => {
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

                                                // show info bubble and set values
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

                                                // hide info bubble
                                                gPolygon.addListener("mouseout", () => {
                                                    gPolygon.setOptions(POLY_OPTIONS);

                                                    this.setState({
                                                        infoBubble: {
                                                            ...this.state.infoBubble,
                                                            show: false
                                                        }
                                                    });
                                                });

                                                this.mapPolygons.push(gPolygon);
                                                // compute incidence and set infos (sidebar)
                                                this.computeRouteIncidenceRollingAVG(routeInfo, m.incidence);
                                                this.props.routeChanged(
                                                    routeInfo.distance,
                                                    routeInfo.distance,
                                                    routeInfo.incidence
                                                );
                                            } else {
                                                console.warn('ERROR: no geo_shapes found')
                                            }
                                        } else {
                                            // console.info('Polygon for ' + m.name + ' already exist on map');
                                        }
                                    });

                                    if(index+1 === waypointsChunks.length) {
                                        this.setState({ isLoading: false });
                                    }
                                }
                            });


                        });

                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
        } else {
            // remove route, marker and polygons
            this.props.routeChanged(0, 0, 0);
            removeRoute(this.directionsRenderer);
            removeMarker(this.locationMarker);
            removePolygons(this.mapPolygons);

            // set a marker if locationFrom or locationTo empty yet
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

    computeRouteInfos(routes: google.maps.DirectionsResult) {
        const route = routes.routes[0];

        let result = {
            distance:          0,
            duration:          0,
            incidence:         null,
            numMunicipalities: 0
        };

        if (!route || !route.legs) return result;

        route.legs.forEach((leg: any) => {
            result.distance  += leg.distance!.value;
            result.duration  += leg.duration!.value;
        });

        result.distance /= 1000;
        result.duration /= 60;

        return result;
    }

    computeRouteIncidenceRollingAVG(routeInfo: any, incidence: number | undefined) {
        let result = 0;

        if(incidence || incidence === 0) {
            if(routeInfo.incidence || routeInfo.incidence === 0){
                    console.log('add', incidence, routeInfo.numMunicipalities);
                    result = (routeInfo.numMunicipalities - 1) * routeInfo.incidence;
                    result += incidence;
                    routeInfo.incidence = result / routeInfo.numMunicipalities;
            } else {
                routeInfo.incidence = incidence;
            }
        }
    }

    componentDidUpdate() {
        // handle map only if travelMode or coords has been changed
        if (
            this.state.mapLoaded && ((
                !areLocationsEqual(this.locationFromBefore, this.props.locationFrom) ||
                !areLocationsEqual(this.locationToBefore, this.props.locationTo) ||
                !areLocationArraysEqual(this.locationStopOversBefore, this.props.locationStopOvers)
            ) || this.props.travelMode !== this.travelModeBefore)
        ) {
            this.locationFromBefore         = this.props.locationFrom;
            this.locationToBefore           = this.props.locationTo;
            this.locationStopOversBefore    = this.props.locationStopOvers;
            this.travelModeBefore           = this.props.travelMode;

            this.state.mapLoaded && this.handleMap();
        }
    }

    render() {
        const {defaultCenter, defaultZoom, center} = this.state;

        return (
            <div className={'gmap-wrapper'}>
                { this.state.isLoading &&
                    <div className='is-loading'>
                        <ImSpinner2 className='icon-spin' />
                        <span>loading incidence overlay</span>
                    </div>
                }
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

export default GoogleMaps;
