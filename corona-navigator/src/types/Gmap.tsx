import {Coords} from "google-map-react";
import {RouteInfos} from "./RouteInfos";

export interface GmapProps {
    locationFrom:       Coords | undefined;
    locationTo:         Coords | undefined;
    locationStopOvers:  Coords[] | undefined;
    travelMode:         google.maps.TravelMode;
    routeChanged:       (routeInfo: RouteInfos) => void;
}

export interface GmapState {
    defaultCenter:   Coords | undefined;
    center:          Coords | undefined;
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
