import React, {Component} from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
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

interface InfoBubbleState {
}

class InfoBubble extends Component<InfoBubbleProps & WrappedComponentProps, InfoBubbleState> {

    render() {
        const {data} = this.props;
        const {intl} = this.props;
        return (
            data.show &&
            <div className='infoBubble'>
                <span className="infoBubble--municipality">
                    {data.municipality}
                </span>
                <span className="infoBubble--incidence">
                {intl.formatMessage({id: 'incidence'})}:
                    <span>{data.incidence}</span>
                </span>
            </div>
        );
    }
}

export default injectIntl(InfoBubble);
