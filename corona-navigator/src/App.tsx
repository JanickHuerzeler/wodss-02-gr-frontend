import React, {Component} from "react";
import "./App.scss";
import {Button, Form, FormControl, Nav, Navbar} from "react-bootstrap";
import GoogleMaps from "./components/Gmap";
// import Example from "./components/Example";
// import LocationInput from "./components/LocationInput";
import {object, string} from "prop-types";
import SearchBar from "./components/SearchBar";
import Apitest from "./components/Apitest";
import {Coords} from "google-map-react";

interface AppProps {
}

interface AppState {
    locationFrom: Coords | undefined;
    locationTo: Coords | undefined;
}

class App extends Component<AppProps, AppState> {
    state: AppState = {
        locationFrom: undefined,
        locationTo: undefined
    }

    locationFromChanged = (lat: number | null, lng: number | null) => {
        const location = (!lat || !lng) ? undefined : { lat: lat, lng: lng };
        this.setState({ locationFrom: location });
    }
    locationToChanged = (lat: number | null, lng: number | null) => {
        const location = (!lat || !lng) ? undefined : { lat: lat, lng: lng };
        this.setState({ locationTo: location });
    }

    render() {
        return (
            <div className='App'>
                <div className='nav-header'>
                    <div className='search-wrapper'>
                        <div className='search-bar'>
                            <SearchBar
                                placeholder="Von"
                                onLocationChanged={this.locationFromChanged}
                            />
                        </div>

                        <div className='search-bar'>
                            <SearchBar
                                placeholder="Bis"
                                onLocationChanged={this.locationToChanged}
                            />
                        </div>
                    </div>
                </div>
                <GoogleMaps
                    locationFrom={this.state.locationFrom}
                    locationTo={this.state.locationTo}
                />
                <Apitest/>
            </div>
        );
    }
}

export default App;
