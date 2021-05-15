// @ts-nocheck
// // src/setupTests.ts
import '@testing-library/jest-dom/extend-expect'

import { configure } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

configure({ adapter: new Adapter() })

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