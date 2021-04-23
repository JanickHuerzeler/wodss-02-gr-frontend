export const removeRoute = (directionsRenderer: any) => {
    directionsRenderer.setMap(null);
}

export const removeMarker = (marker: any) => {
    if (marker) marker.setMap(null);
}

export const removePolygons = (polygons: any) => {
    polygons.forEach((polygon: any) => polygon.setMap(null));
}


