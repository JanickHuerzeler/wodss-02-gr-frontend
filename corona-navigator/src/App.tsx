import React from "react";
import "./App.scss";
import { Button, Form, FormControl, Nav, Navbar } from "react-bootstrap";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

function App() {
  return (
    <div className='App'>
      <div className='nav-header'>
        <Navbar className='nav-header'>
          <Navbar.Brand className='light' href='#home'>
            Corona Navigator
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='mr-auto'>
              <Form inline>
                <FormControl
                  type='text'
                  placeholder='Von'
                  className='mr-sm-2'
                />
                <FormControl
                  type='text'
                  placeholder='Nach'
                  className='mr-sm-2'
                />
                <Button variant='outline-light'>Route anzeigen</Button>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <MapContainer className="lfContainer" center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;
