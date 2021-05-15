/**
 * Translation file for corona navigator.
 * Currently supported languages: de-DE, en-GB
 * 
 * Additional Remarks: 
 * `{CT}` placeholder will be replaced with actual canton,
 * if an error message contains an canton specification.
 */

const messages = {
    'de-DE': {
        area:                         'Fläche',
        coordinates:                  'Koordinaten',
        destinationFrom:              'Von',
        destinationTo:                'Nach',
        municipalitiesAlongTheRoute:  'Gemeinden entlang der Route',
        incidence:                    'Inzidenz',
        incidenceDate:                'Inzidenzdatum',
        ddincidenced14:               'Inzidenz (14T)',
        municipality:                 'Gemeinde',
        municipalities:               'Gemeinden',
        population:                   'Bevölkerung',
        sideBarTitle:                 'Corona Wegweiser',
        sideBarFooter:                'Corona Navigator, Gruppe 02 Kt. Graubünden',
        stopover:                     'Zwischenhalt',
        addStopOver:                  'Zwischenhalt hinzufügen',
        removeStopOver:               'Zwischenhalt entfernen',
        loadingIncidenceOverlay:      'Inzidenzen werden geladen',
        loadingFinished:              'Inzidenzen erfolgreich geladen',
        infographicIncidence:         'Durchschnitts-Inzidenz',
        infographicDuration:          'Reisedauer',
        infographicDistance:          'Distanz',
        tavelModeDriving:             'Fahren',
        tavelModeTransit:             'ÖV',
        tavelModeWalking:             'Wandern',
        tavelModeBicycling:           'Fahrrad',
        errorMessageTimeout:          'Verbindungsprobleme mit Kantonsservice {CT}',
        error:                        '😷 Ein Fehler ist aufgetreten: ',
        errorMessageHttpError:        'Fehler Inzidenzdienst: ',
        errorMessageNoResponse:       'Inzidenzdienst nicht erreichbar',
        errorMessageRequestError:     'Verbindungsaufbau fehlgeschlagen: ',
        interval14:                   '14 Tage',
        interval7:                    '7 Tage',
        intervalAll:                  'Seit 26.02.2020',
        chartTitle:                   'Tagesinzidenzen in ',
        chartXTitle:                  'Datum',
        chartYTitle:                  'Tagesinzidenz',
        chartLoading:                 'Laden',
        chartDataNotAvailable:        'Grafikdaten konnten vom Kantonsservice {CT} nicht geladen werden'
    },
    'en-GB': {
        area: 'Area',
        coordinates:                  'coordinates',
        destinationFrom:              'From',
        destinationTo:                'To',
        municipalitiesAlongTheRoute:  'Municipalities along the route',
        incidence:                    'Incidence',
        incidenceDate:                'Incidence date',
        ddincidenced14:               'Incidence (14d)',
        municipality:                 'Municipality',
        municipalities:               'Municipalities',
        population:                   'Population',
        sideBarTitle:                 'Corona Navigator',
        sideBarFooter:                'Corona Navigator, Group 02 Ct. Graubünden',
        stopover:                     'Stopover',
        addStopOver:                  'Add stopover',
        removeStopOver:               'Remove stopover',
        loadingIncidenceOverlay:      'Incidences are loading',
        loadingFinished:              'Incidences successfully loaded',
        infographicIncidence:         'Mean incidence',
        infographicDuration:          'Travel duration',
        infographicDistance:          'Distance',
        tavelModeDriving:             'Driving',
        tavelModeTransit:             'Transit',
        tavelModeWalking:             'Walking',
        tavelModeBicycling:           'Bicycling',
        errorMessageTimeout:          'Timeout occured for canton service {CT}',
        error:                        '😷 An error occured: ',
        errorMessageHttpError:        'Error incidence service: ',
        errorMessageNoResponse:       'Incidence service not available',
        errorMessageRequestError:     'Request setup failed: ',
        interval14:                   '14 Days',
        interval7:                    '7 Days',
        intervalAll:                  'Since 26.02.2020',
        chartTitle:                   'Daily Incidences in ',
        chartXTitle:                  'Date',
        chartYTitle:                  'Daily Incidence',
        chartLoading:                 'Loading',
        chartDataNotAvailable:        'Chart data could not be loaded from canton service {CT}'
    }

}

export default messages
