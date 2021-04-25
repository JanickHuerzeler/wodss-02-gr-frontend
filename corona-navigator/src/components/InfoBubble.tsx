import React, {Component} from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import "../scss/InfoBubble.scss";

interface InfoBubbleProps {
    lat:           string;
    lng:           string;
    data: {
        show:      boolean;
        lat:       string;
        lng:       string;
        name:      string | undefined;
        zip:       number | undefined;
        incidence: number | undefined;
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
                    {data.zip} {data.name}
                </span>
                <span className="infoBubble--incidence">
                {intl.formatMessage({id: 'incidence'})}:
                    <span>{(data.incidence || data.incidence === 0) ? data.incidence.toFixed(1) : '?'}</span>
                </span>
            </div>
        );
    }
}

export default injectIntl(InfoBubble);
