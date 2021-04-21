import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import "./Gmap.scss";
const AnyReactComponent = ({ text }:any) => <div>{text}</div>;
declare var google: any;

class GoogleMaps extends Component<{}, any> {
    static defaultProps = {
        center: {
            lat: 47.52422,  // Waldhütte Würenlingen
            lng: 8.26181
        },
        zoom: 12
    };

    constructor(props:any) {
        super(props);

        this.state = {
            currentLocation: { lat: 47.52422, lng: 8.26181 } // Waldhütte Würenlingen
        };
    }

    render() {
        const apiIsLoaded = (map: any, maps: any) => {
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);
            const origin =      { lat: 47.59436, lng: 8.29111 }; // Zurzi
            // const origin =      { lat: 46.80356, lng: 10.29872 }; // Scuol
             const destination = { lat: 47.48107, lng: 8.21162 }; // Brugg EG Bar
            // const destination = { lat: 52.55635, lng: 7.59403 }; // Basel
            //const destination = { lat: 47.37624, lng: 6.92352 }; // Réclère

            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING
                },
                (result: any, status: any) => {
                    let routeLine;
                    if (status === google.maps.DirectionsStatus.OK) {
                        console.log('result', result);
                        console.log('status', status);
                        directionsRenderer.setDirections(result);

                        const linePath: any = [];

                        result.routes[0].overview_path.forEach(function (rm:any) {
                            linePath.push({lat: parseFloat(rm.lat()), lng: parseFloat(rm.lng())});
                        })

                        routeLine = new google.maps.Polyline({
                            path: linePath,
                            strokeColor: "#f45017",
                            strokeOpacity: 1.0,
                            strokeWeight: 5,
                            map: map
                        });

                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
        };
        return (
            <div className={'gmap-wrapper'}>
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: "AIzaSyD3ZvcgmIsF6p9Rby2d2QEaasY-TPFXjrg"
                    }}
                    defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
                    defaultZoom={13}
                    center={this.state.currentLocation}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
                >
                    <AnyReactComponent
                        lat={47.52422}
                        lng={8.26181}
                        text="My Marker"
                    />
                </GoogleMapReact>
            </div>
        );
    }
}
export default GoogleMaps;
