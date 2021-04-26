import {RouteInfos} from "./RouteInfos";
import {StopOverCoords} from "./StopOverCoords";

export interface SideBarProps {
    rtl:                      boolean;
    collapsed:                boolean;
    toggled:                  boolean;
    locales:                  { [key: string]: string };
    localeChanged:            (locale: string) => void;
    handleToggleSidebar:      (toggle: boolean) => void;
    locationFromChanged:      (lat: number | null, lng: number | null) => void;
    locationToChanged:        (lat: number | null, lng: number | null) => void;
    locationStopOversChanged: (coordsArray: StopOverCoords[]) => void;
    travelModeChanged:        (travelMode: google.maps.TravelMode) => void;
    routeInfos:               RouteInfos;
}

export interface SideBarState {
    stopOvers:  StopOverCoords[];
    travelMode: string;
}
