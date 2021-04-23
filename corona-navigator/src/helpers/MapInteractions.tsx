/**
 * TODO: describe me
 *
 * @param directionsRenderer
 */
export const removeRoute = (directionsRenderer: any) => {
    directionsRenderer.setMap(null);
}

/**
 * TODO: describe me
 *
 * @param marker
 */
export const removeMarker = (marker: any) => {
    if (marker) marker.setMap(null);
}

/**
 * TODO: describe me
 *
 * @param polygons
 */
export const removePolygons = (polygons: any) => {
    polygons.forEach((polygon: any) => polygon.setMap(null));
}


