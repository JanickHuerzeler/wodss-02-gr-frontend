import {MunicipalityDTO} from "../api";

export interface RouteInfos {
    distance:       number;
    duration:       number;
    incidence:      number | null;
    municipalities: {
        municipality: MunicipalityDTO,
        index: number
    }[]
}
