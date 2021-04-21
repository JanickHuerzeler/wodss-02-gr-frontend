import React from 'react';
import "./SearchBar.scss";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { classnames } from '../helpers';

class SearchBar extends React.Component<{ placeholder: string }, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            address: '',
            errorMessage: '',
            latitude: null,
            longitude: null,
            isGeocoding: false,
        };
    }

    handleChange = (address: any) => {
        this.setState({
            address,
            latitude: null,
            longitude: null,
            errorMessage: '',
        });
    };

    handleSelect = (selected: any) => {
        this.setState({ isGeocoding: true, address: selected });
        geocodeByAddress(selected)
            .then((res: any) => getLatLng(res[0]))
            .then(({ lat, lng }: any) => {
                this.setState({
                    latitude: lat,
                    longitude: lng,
                    isGeocoding: false,
                });
            })
            .catch((error: any) => {
                this.setState({ isGeocoding: false });
                console.log('error', error); // eslint-disable-line no-console
            });
    };

    handleCloseClick = () => {
        this.setState({
            address: '',
            latitude: null,
            longitude: null,
        });
    };

    handleError = (status: any, clearSuggestions: () => void) => {
        console.log('Error from Google Maps API', status); // eslint-disable-line no-console
        this.setState({ errorMessage: status }, () => {
            clearSuggestions();
        });
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
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                        return (
                            <div className="SearchBar__search-bar-container">
                                <div className="SearchBar__search-input-container">
                                    <input
                                        {...getInputProps({
                                            placeholder: this.props.placeholder,
                                            className: 'SearchBar__search-input',
                                        })}
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
                                        {suggestions.map((suggestion: any) => {
                                            // @ts-ignore
                                            const className = classnames('SearchBar__suggestion-item', {
                                                'SearchBar__suggestion-item--active': suggestion.active,
                                            });

                                            return (
                                                /* eslint-disable react/jsx-key */
                                                <div
                                                    {...getSuggestionItemProps(suggestion, { className })}
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
                                <i className="fa fa-spinner fa-pulse fa-3x fa-fw SearchBar__spinner" />
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
