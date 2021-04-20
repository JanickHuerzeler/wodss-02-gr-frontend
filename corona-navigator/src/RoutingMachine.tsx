// import { MapLayer } from "react-leaflet";
import L, { Map } from "leaflet";
import "leaflet-routing-machine";
import "lrm-google";
// import { withLeaflet } from "react-leaflet";

class Routing extends Map {
  createLeafletElement() {
    // const { map } = this.props;
    // let leafletElement = L.Routing.control({
    //   waypoints: [
    //     L.latLng(16.506, 80.648),
    //     L.latLng(17.384, 78.4866),
    //     L.latLng(12.971, 77.5945)
    //   ],
    //   // router: new L.Routing.Google(),
    //   lineOptions: {
    //     styles: [
    //       {
    //         color: "blue",
    //         opacity: 0.6,
    //         weight: 4
    //       }
    //     ]
    //   },
    //   addWaypoints: false,
    //   draggableWaypoints: false,
    //   fitSelectedRoutes: false,
    //   showAlternatives: false
    // }).addTo(map.leafletElement);
    // return leafletElement.getPlan();
  }
}
// export default withLeaflet(Routing);
