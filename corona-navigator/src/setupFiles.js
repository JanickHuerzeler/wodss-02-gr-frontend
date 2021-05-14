// /**
//  * srcSetupTests.js explained here:
//  * https://create-react-app.dev/docs/running-tests#srcsetuptestsjs
//  * https://github.com/facebook/create-react-app/issues/9706
//  * 
//  * Config ideas from: 
//  * https://github.com/hibiken/react-places-autocomplete/issues/189#issuecomment-418555543
//  * https://github.com/hibiken/react-places-autocomplete/issues/189#issuecomment-377770674
//  * 
//  * Further Google Maps mocking ideas?:
//  * https://spin.atomicobject.com/2020/10/03/unit-test-google-maps-api/
//  * https://www.grzegorowski.com/how-to-mock-global-window-with-jest
//  * https://github.com/jmarceli/mock-window
//  */

global.google ={
    maps:{
        Marker:class{},
        Map:class{ setTilt(){} fitBounds(){}},
        LatLngBounds:class{},
        places:{
            Autocomplete: class {},
            AutocompleteService:class{},
            PlacesServiceStatus: {
                INVALID_REQUEST: 'INVALID_REQUEST',
                NOT_FOUND: 'NOT_FOUND',
                OK: 'OK',
                OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
                REQUEST_DENIED: 'REQUEST_DENIED',
                UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                ZERO_RESULTS: 'ZERO_RESULTS',
            },
            PlacesAutocomplete:{
                INVALID_REQUEST: 'INVALID_REQUEST',
                NOT_FOUND: 'NOT_FOUND',
                OK: 'OK',
                OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
                REQUEST_DENIED: 'REQUEST_DENIED',
                UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                ZERO_RESULTS: 'ZERO_RESULTS',
            }
        },
        TravelMode: {
            BICYCLING: 'BICYCLING',
            DRIVING: 'DRIVING',
            TRANSIT: 'TRANSIT',
            TWO_WHEELER: 'TWO_WHEELER',
            WALKING: 'WALKING',
        },

        MarkerClusterer:class{},
    }
};
