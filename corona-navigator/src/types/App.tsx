import {Coords} from "google-map-react";
import {RouteInfos} from "./RouteInfos";
import {Coordinates} from "./Coordinates";

/**
 * Properties and State type definitions for App-Component
 */

export interface AppProps {

}

export interface AppState {
    locationFrom:      Coordinates;
    locationTo:        Coordinates;
    locationStopOvers: Coords[];
    travelMode:        google.maps.TravelMode;
    locale:            string;
    rtl:               boolean;
    toggled:           boolean;
    collapsed:         boolean;
    messages:          { [key: string]: any };
    routeInfos:        RouteInfos
}
