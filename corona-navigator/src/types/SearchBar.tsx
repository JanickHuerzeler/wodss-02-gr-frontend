/**
 * Properties and State type definitions for SearchBar-Component
 */
export interface SearchBoxProps {
    onLocationChanged: (
        latitude:  number | null,
        longitude: number | null
    ) => void;
    onRemoveSearchbar?: (
        index: number
    ) => void;
    placeholder:    string;
    focus:          boolean;
    tabIndex:       number;
    stopOverIndex?: number;
}

export interface SearchBoxState {
    address:      string;
    errorMessage: string;
    latitude:     number | null;
    longitude:    number | null;
}
