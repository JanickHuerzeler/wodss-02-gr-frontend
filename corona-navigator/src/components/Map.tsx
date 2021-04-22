import React, { Component } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default class MapComponent extends Component {
  state = {
    lat: 57.74,
    lng: 11.94,
    zoom: 13,
    isMapInit: false,
  };

  saveMap = (map: any) => {
    this.map = map;
    this.setState({
      isMapInit: true,
    });
  };
    map: any;

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div></div>
      // <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      //   <TileLayer
      //     attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      //     url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      //   />
      //   <Marker position={[51.505, -0.09]}>
      //     <Popup>
      //       A pretty CSS3 popup. <br /> Easily customizable.
      //     </Popup>
      //   </Marker>
      //   {this.state.isMapInit
      //   // && <Routing map={this.map} />
      //   }
      // </MapContainer>
    );
  }
}
