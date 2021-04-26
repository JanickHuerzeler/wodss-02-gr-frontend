import {Coords} from "google-map-react";
import {RouteInfos} from "./RouteInfos";

export interface AppProps {

}

export interface AppState {
    locationFrom:      Coords | undefined;
    locationTo:        Coords | undefined;
    locationStopOvers: Coords[];
    travelMode:        google.maps.TravelMode;
    locale:            string;
    rtl:               boolean;
    toggled:           boolean;
    collapsed:         boolean;
    messages:          { [key: string]: any };
    routeInfos:        RouteInfos
}
