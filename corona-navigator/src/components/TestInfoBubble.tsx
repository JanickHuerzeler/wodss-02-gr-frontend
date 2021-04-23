import React, {Component} from "react";
import "./TestInfoBubble.scss";
import {Coords} from "google-map-react";

interface AppProps {
    lat: string;
    lng: string;
    municipality: string;
    incidence: number;
}

interface AppState {
}

class TestInfoBubble extends Component<AppProps, AppState> {
    render() {
        return (
            <div className='infoBubble'>
                <span className="infoBubble--municipality">{this.props.municipality}</span>
                <span className="infoBubble--incidence">Incidence: <span>{this.props.incidence}</span></span>
            </div>
        );
    }
}

export default TestInfoBubble;
