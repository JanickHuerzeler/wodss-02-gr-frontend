import {Coords} from "google-map-react";
import {RouteInfos} from "./RouteInfos";
import {InfoBubble} from "./InfoBubble";
import { MunicipalityDTO } from "../api";

/**
 * Properties and State type definitions for Gmap-Component
 */
export interface GmapProps {
    locationFrom:       Coords | undefined;
    locationTo:         Coords | undefined;
    locationStopOvers:  Coords[] | undefined;
    travelMode:         google.maps.TravelMode;
    routeChanged:       (routeInfo: RouteInfos) => void;
    selectedLocale:     string;
    selectedMunicipalityChanged:    (selectedMunicipality: MunicipalityDTO) => void;
}

export interface GmapState {
    defaultCenter:      Coords | undefined;
    center:             Coords | undefined;
    defaultZoom:        number;
    map:                any | null;
    mapLoaded:          boolean;
    isLoading:          boolean;
    loaded:             boolean;
    uniqueId:           number;
    infoBubble:         InfoBubble;
    timeoutCantons:     string[];
    noServerResponse:   boolean;
    chunkSize:          number;
}
