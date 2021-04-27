import {MunicipalityDTO} from "../api";

/**
 * Type definition for route infos
 */

export interface RouteInfos {
    distance:         number;
    duration:         number;
    incidence:        number | null;
    municipalities: {
        municipality: MunicipalityDTO,
        index:        number
    }[]
}
