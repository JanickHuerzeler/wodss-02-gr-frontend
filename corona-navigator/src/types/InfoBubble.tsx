/**
 * Properties and State type definitions for InfoBubble-Component
 */
export interface InfoBubble {
    show:               boolean;
    lat:                string;
    lng:                string;
    name:               string | undefined;
    zip:                number | undefined;
    incidence:          number | undefined;
}

export interface InfoBubbleProps {
    lat:  string;
    lng:  string;
    data: InfoBubble;
}

export interface InfoBubbleState {

}
