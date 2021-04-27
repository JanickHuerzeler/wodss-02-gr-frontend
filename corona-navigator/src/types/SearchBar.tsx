/**
 * Properties and State type definitions for SearchBar-Component
 */
export interface SearchBoxProps {
    onLocationChanged: (
        latitude:  number | null,
        longitude: number | null
    ) => void;
    placeholder:   string;
    focus:         boolean;
    tabIndex:      number;
}

export interface SearchBoxState {
    address:      string;
    errorMessage: string;
    latitude:     number | null;
    longitude:    number | null;
    isGeocoding:  boolean;
}
