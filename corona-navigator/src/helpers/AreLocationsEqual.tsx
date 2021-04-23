import {Coords} from "google-map-react";

export const areLocationsEqual = (locationOld: Coords | undefined, locationNew: Coords | undefined): boolean => {
    return (!locationOld || !locationNew)
        ? (!locationOld && !locationNew)
        : (locationOld.lat === locationNew.lat && locationOld.lng === locationNew.lng)
}
