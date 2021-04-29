import React from 'react';
import "../scss/SearchBar.scss";
import {SearchBoxProps, SearchBoxState} from "../types/SearchBar";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';

/**
 * Provides a search box for a location on the map.
 * Based on the searchterm, suggestions of locations are made.
 */
class SearchBar extends React.Component<SearchBoxProps, SearchBoxState> {
    private inputFieldRef: any;
    private randomKey: string = Date.now().toString();
    // set default props
    static defaultProps = {
        focus:    false,
        tabIndex: 1
    }

    constructor(props: any) {
        super(props);

        // set deault state
        this.state = {
            address: '',
            errorMessage: '',
            latitude: null,
            longitude: null
        };

        this.inputFieldRef = null;
    }

    /**
     * Set autofocus when flag is set.
     */
    componentDidMount() {
        if(this.props.focus) this.inputFieldRef.focus();
    }

    /**
     * Set the address searchterm in state for autocompletion.
     * @param {string} address - Currently typed searchterm
     */
    handleChange = (address: string) => {
        this.setState({
            address,
            latitude: null,
            longitude: null,
            errorMessage: ''
        });
    };

    /**
     * The coordinates for the selected address are requested from google maps.
     * @param {string} selected - Selected address by user
     */
    handleSelect = (selected: string) => {
        this.setState({ address: selected });

        // get geocode from google api
        geocodeByAddress(selected)
            .then((res: any) => getLatLng(res[0]))
            .then(({lat, lng}: any) => {
                this.setState({
                    latitude:    lat,
                    longitude:   lng
                });

                // fire change event
                this.props.onLocationChanged(lat, lng);
            })
            .catch((error: any) => {
                console.error('error', error);
            });
    };

    /**
     * clear inputfield and fire changeevent
     */
    handleCloseClick = () => {
        this.setState({
            address: '',
            latitude: null,
            longitude: null,
        });

        // fire change event
        this.props.onLocationChanged(null, null);
    };

    /**
     * Handle errors that may come from the google api and clear suggestions.
     * @param {string} status               - Status message from api
     * @param {() => void} clearSuggestions - Callback to clear suggestions
     */
    handleError = (status: string, clearSuggestions: () => void) => {
        console.error('Error from Google Maps API', status);
        this.setState({errorMessage: status}, () => {
            clearSuggestions();
        });
    };

    /**
     * If the user leaves the search box and it is empty, a locationchanged must be fired.
     */
    handleBlur = () => {
        if(this.state.address === "") {
            this.handleCloseClick()
        }
    };

    handleRemoveStopover = () => {
        if(typeof(this.props.onRemoveSearchbar) === 'function' && this.props.stopOverIndex){
            this.props.onRemoveSearchbar(this.props.stopOverIndex);
        }
    }

    /**
     * Render HTML output
     */
    render() {
        const {
            address,
            errorMessage,
        }: any = this.state;

        return (
            <div key={this.randomKey}>
                <PlacesAutocomplete
                    onChange={this.handleChange}
                    value={address}
                    onSelect={this.handleSelect}
                    onError={this.handleError}
                    shouldFetchSuggestions={address.length > 1}
                    highlightFirstSuggestion={true}
                    searchOptions={{
                        componentRestrictions: {country: "CH"}
                    }}
                >
                    {({getInputProps, suggestions, getSuggestionItemProps}) => {
                        return (
                            <div className="SearchBar__search-bar-container">
                                <div className="SearchBar__search-input-container">
                                    {/* Search input field */}
                                    <input tabIndex={this.props.tabIndex}
                                        ref={(input) => { this.inputFieldRef = input; }}
                                        {...getInputProps({
                                            placeholder: this.props.placeholder,
                                            className: 'SearchBar__search-input',
                                        })}
                                        onBlur={this.handleBlur}
                                    />
                                    
                                    {/* Closebutton */}
                                    {this.state.address.length > 0 && (
                                        <button
                                            className="SearchBar__clear-button"
                                            onClick={this.handleCloseClick}
                                        >x</button>
                                    )}
                                    
                                </div>
                                {/* Show suggestions if there are any */}
                                {suggestions.length > 0 && (
                                    <div className="SearchBar__autocomplete-container">
                                        {suggestions.map((suggestion: any, index: number) => {
                                            let className = 'SearchBar__suggestion-item';
                                            if(suggestion.active) className += ' SearchBar__suggestion-item--active';

                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {className})}
                                                    key={index}
                                                >
                                                    <strong>{suggestion.formattedSuggestion.mainText}</strong>{' '}
                                                    <small>{suggestion.formattedSuggestion.secondaryText}</small>
                                                </div>
                                            );
                                        })}
                                        <div className="SearchBar__dropdown-footer">
                                            <div />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }}
                </PlacesAutocomplete>
                {/* Show errrormessage if there is one */}
                {errorMessage.length > 0 && (
                    <div className="SearchBar__error-message">{this.state.errorMessage}</div>
                )}
            </div>
        );
    }
}

export default SearchBar;
