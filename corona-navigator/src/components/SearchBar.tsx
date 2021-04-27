import React from 'react';
import "../scss/SearchBar.scss";
import {SearchBoxProps, SearchBoxState} from "../types/SearchBar";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';

/**
 * TODO: describe me
 */
class SearchBar extends React.Component<SearchBoxProps, SearchBoxState> {
    private inputFieldRef: any;

    // no autofocus per default
    static defaultProps = {
        focus:    false,
        tabIndex: 1
    }

    constructor(props: any) {
        super(props);

        // set efault state
        this.state = {
            address: '',
            errorMessage: '',
            latitude: null,
            longitude: null,
            isGeocoding: false
        };

        this.inputFieldRef = null;
    }
    componentDidMount() {
        // set autofocus
        if(this.props.focus) this.inputFieldRef.focus();
    }

    // set new address
    handleChange = (address: any) => {
        this.setState({
            address,
            latitude: null,
            longitude: null,
            errorMessage: '',
        });
    };

    // set new address data
    handleSelect = (selected: any) => {
        this.setState({isGeocoding: true, address: selected});

        // get geocode from google
        geocodeByAddress(selected)
            .then((res: any) => getLatLng(res[0]))
            .then(({lat, lng}: any) => {
                this.setState({
                    latitude:    lat,
                    longitude:   lng,
                    isGeocoding: false,
                });

                // fire change event
                this.props.onLocationChanged(lat, lng);
            })
            .catch((error: any) => {
                this.setState({isGeocoding: false});
                console.error('error', error);
            });
    };

    // clear inputfield and fire changeevent
    handleCloseClick = () => {
        this.setState({
            address: '',
            latitude: null,
            longitude: null,
        });

        this.props.onLocationChanged(null, null);
    };

    // error handling
    handleError = (status: any, clearSuggestions: () => void) => {
        console.error('Error from Google Maps API', status); // eslint-disable-line no-console
        this.setState({errorMessage: status}, () => {
            clearSuggestions();
        });
    };

    // if input field is empty fire closeclick
    handleBlur = () => {
        if(this.state.address === "") {
            this.handleCloseClick()
        }
    };

    render() {
        const {
            address,
            errorMessage,
            latitude,
            longitude,
            isGeocoding,
        }: any = this.state;

        return (
            <div>
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
                                    <input tabIndex={this.props.tabIndex}
                                        ref={(input) => { this.inputFieldRef = input; }}
                                        {...getInputProps({
                                            placeholder: this.props.placeholder,
                                            className: 'SearchBar__search-input',
                                        })}
                                        onBlur={this.handleBlur}
                                    />
                                    {this.state.address.length > 0 && (
                                        <button
                                            className="SearchBar__clear-button"
                                            onClick={this.handleCloseClick}
                                        >
                                            x
                                        </button>
                                    )}
                                </div>
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
                                                    <strong>
                                                        {suggestion.formattedSuggestion.mainText}
                                                    </strong>{' '}
                                                    <small>
                                                        {suggestion.formattedSuggestion.secondaryText}
                                                    </small>
                                                </div>
                                            );
                                        })}
                                        <div className="SearchBar__dropdown-footer">
                                            <div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }}
                </PlacesAutocomplete>
                {errorMessage.length > 0 && (
                    <div className="SearchBar__error-message">{this.state.errorMessage}</div>
                )}

                {((latitude && longitude) || isGeocoding) && (
                    <div className="SearchBar__geocode-result">
                        <h3 className="SearchBar__geocode-result-header">Geocode result</h3>
                        {isGeocoding ? (
                            <div>
                                <i className="fa fa-spinner fa-pulse fa-3x fa-fw SearchBar__spinner"/>
                            </div>
                        ) : (
                            <div>
                                <div className="SearchBar__geocode-result-item--lat">
                                    <label>Latitude:</label>
                                    <span> {latitude}</span>
                                </div>
                                <div className="SearchBar__geocode-result-item--lng">
                                    <label>Longitude:</label>
                                    <span> {longitude}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default SearchBar;
