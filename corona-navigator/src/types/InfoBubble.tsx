export interface InfoBubbleProps {
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

export interface InfoBubbleState {

}
