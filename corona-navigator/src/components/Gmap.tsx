import React, {Component} from "react";
// https://github.com/google-map-react/google-map-react
import GoogleMapReact, {Coords} from "google-map-react";
import "../scss/Gmap.scss";
import InfoBubble from "./InfoBubble";
import {areLocationsEqual} from "../helpers/AreLocationsEqual";
import {removeMarker, removePolygons, removeRoute} from "../helpers/MapInteractions";
import { Api } from "../api/navigatorApi";
import {CoordinateDTO, MunicipalityDTO} from "../api";
import {ImSpinner2} from "react-icons/all";

const API = new Api({baseUrl:'http://localhost:5001'});
const GOOGLE_API_KEY     = "AIzaSyCaORgZFgOduOC08vlydCfxm5jWSmMVnV4";
const DEFAULT_MAP_CENTER = { lat: 47.48107, lng: 8.21162 };
const MAP_OPTIONS        = () => { return {styles: [{stylers: [{'saturation': -99}, {'gamma': .8}, {'lightness': 5}]}]}};

// Props interface
interface GmapProps {
    locationFrom:     Coords | undefined;
    locationTo:       Coords | undefined;
}

// State interface
interface GmapState {
    defaultCenter:    Coords | undefined;
    center:           Coords | undefined;
    defaultZoom:      number;
    map:              any | null;
    mapLoaded:        boolean;
    isLoading:        boolean;
    infoBubble: {
        show:         boolean;
        lat:          string;
        lng:          string;
        name:      string | undefined;
        zip:       number | undefined;
        incidence: number | undefined;
    }
}

/**
 * TODO: describe me
 */
class GoogleMaps extends Component<GmapProps, GmapState> {
    private readonly directionsService:  any;
    private readonly directionsRenderer: any;
    private readonly mapPolygons:        any[];
    private          locationMarker:     any;
    private          locationFromBefore: Coords | undefined;
    private          locationToBefore:   Coords | undefined;

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

        this.directionsService  = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.mapPolygons        = [];
        this.locationMarker     = undefined;
        this.locationFromBefore = undefined;
        this.locationToBefore   = undefined;
    }

    sendWaypointsToBackend(waypoints: CoordinateDTO[], callback: (data: any) => void) {
        API.waypoints.municipalityList(waypoints
        ).then((dt: { data: any; }) => {
             callback(dt.data);
        });
    }

    handleMap = () => {
        this.directionsRenderer.setMap(this.state.map);

        // if location from and to are set, print route
        if (this.props.locationFrom && this.props.locationTo) {
            // remove all polygons
            removePolygons(this.mapPolygons);

            // get and print  route
            this.directionsService.route({
                    origin:      this.props.locationFrom,
                    destination: this.props.locationTo,
                    travelMode:  google.maps.TravelMode.DRIVING,
                },
                (result: any, status: any) => {
                    if (result && status === google.maps.DirectionsStatus.OK) {
                        const waypoints:        any = [];
                        this.setState({ isLoading: true });
                        this.directionsRenderer.setDirections(result);

                        // generate linepath for backend
                        result.routes[0].overview_path.forEach(function (wp: any) {
                            waypoints.push({
                                lat: parseFloat(wp.lat()),
                                lng: parseFloat(wp.lng())
                            });
                        })

                        /*
                        // draw linepath
                        const routeLine = new google.maps.Polyline({
                            path: linePath,
                            strokeColor: "#f45017",
                            strokeOpacity: 1.0,
                            strokeWeight: 5,
                            map: this.state.map
                        });*/

                        /** Call backend for municipalities */
                        this.sendWaypointsToBackend(waypoints, data => {
                            // draw municipality polygons
                            data.forEach((m: MunicipalityDTO) => {
                                if(m.geo_shape) {
                                    const bounds = new google.maps.LatLngBounds();
                                    const gPolygon = new google.maps.Polygon(
                                        {
                                            paths: m.geo_shape.map((coords: CoordinateDTO) => {
                                                const pos = {
                                                    lat: coords.lat || 0,
                                                    lng: coords.lng || 0
                                                };

                                                bounds.extend(pos);
                                                return pos;
                                            }),
                                            strokeColor:   m.incidence_color,
                                            strokeOpacity: .8, // .7
                                            strokeWeight:  1,
                                            fillColor:     m.incidence_color,
                                            fillOpacity:   .3,
                                            map:           this.state.map
                                        }
                                    );

                                    // show info bubble and set values
                                    gPolygon.addListener("mouseover", () => {
                                        gPolygon.setOptions({
                                            strokeOpacity: .95, // .95
                                            fillOpacity:   .6  // .45
                                        });

                                        this.setState({
                                            infoBubble: {
                                                show:      true,
                                                lat:       bounds.getCenter().lat().toString(),
                                                lng:       bounds.getCenter().lng().toString(),
                                                name:      m.name,
                                                zip:       m.plz,
                                                incidence: m.incidence
                                            }
                                        });
                                    });

                                    // hide info bubble
                                    gPolygon.addListener("mouseout", () => {
                                        gPolygon.setOptions({
                                            strokeOpacity: .8,
                                            fillOpacity:   0.3
                                        });

                                        this.setState({
                                            infoBubble: {
                                                ...this.state.infoBubble,
                                                show: false
                                            }
                                        });
                                    });

                                    this.mapPolygons.push(gPolygon);
                                } else {
                                    console.warn('ERROR: no geo_shape found')
                                }
                            });

                            this.setState({ isLoading: false });
                        });
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
        } else {
            // remove route, marker and polygons
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

    componentDidUpdate() {
        // handle map only if coords has been changed
        if (
            this.state.mapLoaded && (
                !areLocationsEqual(this.locationFromBefore, this.props.locationFrom) ||
                !areLocationsEqual(this.locationToBefore, this.props.locationTo)
            )) {
            this.locationFromBefore = this.props.locationFrom;
            this.locationToBefore = this.props.locationTo;
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
