import { Moment } from "moment";
import { MunicipalityDTO } from "../api";

/**
 * Properties and State type definitions for IncidenceHistory-Component
 */
export interface IncidenceHistoryProps {
    selectedLocale:         string;
    selectedMunicipality:   MunicipalityDTO | undefined;
    closeIncidenceChart:    () => void;
    errorOccured:           (toastTitle: string, toastMessage: string) => void;
}

export interface IncidenceHistoryState {
    dateTo:                 Moment;
    dateFrom:               Moment;
    data: {
        timestamp:          Date,
        value:              number
    }[];
    loaded:                 boolean;
    selectedMunicipality:   MunicipalityDTO | undefined;
    previousDateFrom:       Moment | undefined;
    currentWindowWidth:      number;
}

/**
 * Interval Options for Chart Interval Selection of the IncidenceHistory-Component
 */
export interface IntervalOption {
    key: string;
    date: moment.Moment;
}
