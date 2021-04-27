/**
 * Properties and State type definitions for InfoBubble-Component
 */

export interface InfoBubbleProps {
    lat:           string;
    lng:           string;
    data: {
        show:      boolean;
        lat:       string;
        lng:       string;
        name:      string;
        zip:       number;
        incidence: number;
    }
}

export interface InfoBubbleState {

}
