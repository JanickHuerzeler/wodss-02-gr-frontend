import {Coords} from "google-map-react";
import {RouteInfos} from "./RouteInfos";
import {Coordinates} from "./Coordinates";

/**
 * Properties and State type definitions for Gmap-Component
 */

export interface GmapProps {
    locationFrom:       Coordinates;
    locationTo:         Coordinates;
    locationStopOvers:  Coords[] | undefined;
    travelMode:         google.maps.TravelMode;
    routeChanged:       (routeInfo: RouteInfos) => void;
}

export interface GmapState {
    defaultCenter:   Coordinates;
    center:          Coordinates;
    defaultZoom:     number;
    map:             any | null;
    mapLoaded:       boolean;
    isLoading:       boolean;
    loaded:          boolean;
    uniqueId:        number;
    infoBubble: {
        show:        boolean;
        lat:         string;
        lng:         string;
        name:        string | undefined;
        zip:         number | undefined;
        incidence:   number | undefined;
    }
}
