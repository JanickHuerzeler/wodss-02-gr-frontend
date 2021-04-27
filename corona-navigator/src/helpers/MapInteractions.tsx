/**
 * Removes the route that is currently on the map.
 * @param {google.maps.DirectionsRenderer} directionsRenderer - Contains the directions renderer from google maps.
 */
export const removeRoute = (directionsRenderer: google.maps.DirectionsRenderer) => {
    directionsRenderer.setMap(null);
}

/**
 * Removes the marker that is currently on the map.
 * @param {google.maps.Marker} marker - Contains the marker to remove. Can be undefined!
 */
export const removeMarker = (marker: google.maps.Marker | undefined) => {
    if (marker) marker.setMap(null);
}

/**
 * Removes all polygons that are currently on the map.
 * @param {google.maps.Polygon[]} polygons - Contains all polygons to be removed.
 */
export const removePolygons = (polygons: google.maps.Polygon[]) => {
    polygons.forEach((polygon: any) => polygon.setMap(null));
}


