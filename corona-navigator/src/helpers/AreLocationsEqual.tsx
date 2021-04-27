import {Coords} from "google-map-react";

/**
 * TODO: describe me
 *
 * @param locationOld
 * @param locationNew
 */
export const areLocationsEqual = (locationOld: Coords | undefined, locationNew: Coords | undefined): boolean => {
    return (!locationOld || !locationNew)
        ? (!locationOld && !locationNew)
        : (locationOld.lat === locationNew.lat && locationOld.lng === locationNew.lng)
}

export const areLocationArraysEqual = (locationArrayOld: Coords[] | undefined, locationArrayNew: Coords[] | undefined): boolean =>{
    return Array.isArray(locationArrayOld) && Array.isArray(locationArrayNew) &&
    locationArrayOld.length === locationArrayNew.length &&
    locationArrayOld.every((val, index) => areLocationsEqual(val, locationArrayNew[index]));
}
