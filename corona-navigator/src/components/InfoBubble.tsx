import React, {Component} from "react";
import "../scss/InfoBubble.scss";
import {injectIntl, WrappedComponentProps} from "react-intl";
import {InfoBubbleProps, InfoBubbleState} from "../types/InfoBubble";

/**
 * Render the info bubble with the municipality information zip code,location and incidence.
 */
class InfoBubble extends Component<InfoBubbleProps & WrappedComponentProps, InfoBubbleState> {
    /**
     * Render HTMl output
     */
    render() {
        const {data,intl} = this.props;
        return (
            /* Show only if property show is true*/
            data.show &&
            <div className='infoBubble'>
                <span className="infoBubble--municipality">
                    {data.zip} {data.name}
                </span>
                <span className="infoBubble--incidence">
                    {intl.formatMessage({id: 'incidence'})}:
                    <span>
                        {/* If incidence not set, show a question mark */}
                        {(data.incidence || data.incidence === 0) ? data.incidence.toFixed(1) : '?'}
                    </span>
                </span>
            </div>
        );
    }
}

export default injectIntl(InfoBubble);
