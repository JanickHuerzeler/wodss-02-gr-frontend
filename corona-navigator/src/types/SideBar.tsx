import {RouteInfos} from "./RouteInfos";
import {Coordinates} from "./Coordinates";
import { MunicipalityDTO } from "../api";

/**
 * Properties and State type definitions for SideBar-Component
 */
export interface SideBarProps {
    rtl:                            boolean;
    collapsed:                      boolean;
    toggled:                        boolean;
    locales:                        { [key: string]: string };
    localeChanged:                  (locale: string) => void;
    handleToggleSidebar:            (toggle: boolean) => void;
    locationFromChanged:            (lat: number | null, lng: number | null) => void;
    locationToChanged:              (lat: number | null, lng: number | null) => void;
    locationStopOversChanged:       (coordsArray: Coordinates[]) => void;
    travelModeChanged:              (travelMode: google.maps.TravelMode) => void;
    routeInfos:                     RouteInfos;
    selectedMunicipalityChanged:    (selectedMunicipality: MunicipalityDTO) => void;
}

export interface SideBarState {
    stopOvers:                  Coordinates[];
    travelMode:                 string;
    routeListHeight:            number;
}
