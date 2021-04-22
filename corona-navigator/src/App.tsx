import React from "react";
import "./App.scss";
import { Button, Form, FormControl, Nav, Navbar } from "react-bootstrap";
import GoogleMaps from "./components/Gmap";
// import Example from "./components/Example";
// import LocationInput from "./components/LocationInput";
import {object, string} from "prop-types";
import SearchBar from "./components/SearchBar";
import Apitest from "./components/Apitest";

function App(this: any) {
  return (
    <div className='App'>
        <div className='nav-header'>
            <div className='search-wrapper'>
                <div className='search-bar'>
                    <SearchBar placeholder="Von" />
                </div>

                <div className='search-bar'>
                    <SearchBar placeholder="Bis" />
                </div>
            </div>
        </div>
        <GoogleMaps />
        <Apitest />
    </div>
  );
}

export default App;
