import {Coords} from "google-map-react";

/**
 * Checks if a location is equal to the other (Deepcheck).
 * @param {Coords | undefined} locationOld - Origin coordinates.
 * @param {Coords | undefined} locationNew - Destination coordinates.
 */
export const areLocationsEqual = (locationOld: Coords | undefined, locationNew: Coords | undefined): boolean => {
    //
    return (!locationOld || !locationNew)
        ? (!locationOld && !locationNew)
        : (locationOld.lat === locationNew.lat && locationOld.lng === locationNew.lng)
}

/**
 * Checks if an array of locations is equal to the other array (Deepcheck).
 * Uses the "areLocationsEqual" function to check the individual array values.
 * @param {Coords[] | undefined} locationArrayOld - Array contains origin coordinates.
 * @param {Coords[] | undefined} locationArrayNew - Array contains destination coordinates.
 */
export const areLocationArraysEqual = (locationArrayOld: Coords[] | undefined, locationArrayNew: Coords[] | undefined): boolean =>{
    return Array.isArray(locationArrayOld) && Array.isArray(locationArrayNew) &&
    locationArrayOld.length === locationArrayNew.length &&
    locationArrayOld.every((val, index) => areLocationsEqual(val, locationArrayNew[index]));
}
