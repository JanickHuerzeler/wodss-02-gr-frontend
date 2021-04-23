import React, {Component} from "react";
import "../scss/InfoBubble.scss";

interface InfoBubbleProps {
    lat:              string;
    lng:              string;
    data: {
        show:         boolean;
        lat:          string;
        lng:          string;
        municipality: string;
        incidence:    number;
    }
}

/**
 * TODO: describe me
 */
class InfoBubble extends Component<InfoBubbleProps, any> {

    render() {
        const {data} = this.props;

        return (
            data.show &&
            <div className='infoBubble'>
                <span className="infoBubble--municipality">
                    {data.municipality}
                </span>
                <span className="infoBubble--incidence">
                    Incidence:
                    <span>{data.incidence}</span>
                </span>
            </div>
        );
    }
}

export default InfoBubble;
