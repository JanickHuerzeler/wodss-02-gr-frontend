/* tslint:disable */
/* eslint-disable */
/**
 * WODSS Gruppe 02 Backend API
 * API for WODSS Gruppe 02 Backend
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';

/**
 * 
 * @export
 * @interface CoordinateDTO
 */
export interface CoordinateDTO {
    /**
     * 
     * @type {number}
     * @memberof CoordinateDTO
     */
    lat?: number;
    /**
     * 
     * @type {number}
     * @memberof CoordinateDTO
     */
    lng?: number;
}
/**
 * 
 * @export
 * @interface IncidenceDTO
 */
export interface IncidenceDTO {
    /**
     * 
     * @type {number}
     * @memberof IncidenceDTO
     */
    bfsNr?: number;
    /**
     * 
     * @type {string}
     * @memberof IncidenceDTO
     */
    date?: string;
    /**
     * 
     * @type {number}
     * @memberof IncidenceDTO
     */
    incidence?: number;
}
/**
 * 
 * @export
 * @interface MunicipalityDTO
 */
export interface MunicipalityDTO {
    /**
     * 
     * @type {number}
     * @memberof MunicipalityDTO
     */
    bfs_nr?: number;
    /**
     * 
     * @type {string}
     * @memberof MunicipalityDTO
     */
    canton?: string;
    /**
     * 
     * @type {Array<Array<CoordinateDTO>>}
     * @memberof MunicipalityDTO
     */
    geo_shapes?: Array<Array<CoordinateDTO>>;
    /**
     * 
     * @type {number}
     * @memberof MunicipalityDTO
     */
    incidence?: number;
    /**
     * 
     * @type {string}
     * @memberof MunicipalityDTO
     */
    incidence_color?: string;
    /**
     * 
     * @type {string}
     * @memberof MunicipalityDTO
     */
    incidence_date?: string;
    /**
     * 
     * @type {string}
     * @memberof MunicipalityDTO
     */
    name?: string;
    /**
     * 
     * @type {number}
     * @memberof MunicipalityDTO
     */
    plz?: number;
}
/**
 * 
 * @export
 * @interface MunicipalityMetadataDTO
 */
export interface MunicipalityMetadataDTO {
    /**
     * 
     * @type {number}
     * @memberof MunicipalityMetadataDTO
     */
    area?: number;
    /**
     * 
     * @type {number}
     * @memberof MunicipalityMetadataDTO
     */
    bfs_nr?: number;
    /**
     * 
     * @type {string}
     * @memberof MunicipalityMetadataDTO
     */
    canton?: string;
    /**
     * 
     * @type {string}
     * @memberof MunicipalityMetadataDTO
     */
    name?: string;
    /**
     * 
     * @type {number}
     * @memberof MunicipalityMetadataDTO
     */
    population?: number;
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Returns incidences of the given canton with given date filter
         * @param {string} canton two-char canton abbreviation
         * @param {string} [dateFrom] dateFrom - dateFrom is inclusive. If not given, all datasets since beginning.
         * @param {string} [dateTo] dateTo - dateTo is inclusive. If not given, all datasets till today.
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cantonsCantonIncidencesGet: async (canton: string, dateFrom?: string, dateTo?: string, language?: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'canton' is not null or undefined
            assertParamExists('cantonsCantonIncidencesGet', 'canton', canton)
            const localVarPath = `/cantons/{canton}/incidences/`
                .replace(`{${"canton"}}`, encodeURIComponent(String(canton)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (dateFrom !== undefined) {
                localVarQueryParameter['dateFrom'] = dateFrom;
            }

            if (dateTo !== undefined) {
                localVarQueryParameter['dateTo'] = dateTo;
            }

            if (language !== undefined) {
                localVarQueryParameter['language'] = language;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Returns municipality of the given canton and bfs-nr
         * @param {string} canton two-char canton abbreviation
         * @param {string} bfsNr bfsNr
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cantonsCantonMunicipalitiesBfsNrGet: async (canton: string, bfsNr: string, language?: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'canton' is not null or undefined
            assertParamExists('cantonsCantonMunicipalitiesBfsNrGet', 'canton', canton)
            // verify required parameter 'bfsNr' is not null or undefined
            assertParamExists('cantonsCantonMunicipalitiesBfsNrGet', 'bfsNr', bfsNr)
            const localVarPath = `/cantons/{canton}/municipalities/{bfsNr}/`
                .replace(`{${"canton"}}`, encodeURIComponent(String(canton)))
                .replace(`{${"bfsNr"}}`, encodeURIComponent(String(bfsNr)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (language !== undefined) {
                localVarQueryParameter['language'] = language;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Returns incidences of the given canton and bfs-nr with given date filter
         * @param {string} canton two-char canton abbreviation
         * @param {string} bfsNr bfsNr
         * @param {string} [dateFrom] dateFrom - dateFrom is inclusive. If not given, all datasets since beginning.
         * @param {string} [dateTo] dateTo - dateTo is inclusive. If not given, all datasets till today.
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cantonsCantonMunicipalitiesBfsNrIncidencesGet: async (canton: string, bfsNr: string, dateFrom?: string, dateTo?: string, language?: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'canton' is not null or undefined
            assertParamExists('cantonsCantonMunicipalitiesBfsNrIncidencesGet', 'canton', canton)
            // verify required parameter 'bfsNr' is not null or undefined
            assertParamExists('cantonsCantonMunicipalitiesBfsNrIncidencesGet', 'bfsNr', bfsNr)
            const localVarPath = `/cantons/{canton}/municipalities/{bfsNr}/incidences/`
                .replace(`{${"canton"}}`, encodeURIComponent(String(canton)))
                .replace(`{${"bfsNr"}}`, encodeURIComponent(String(bfsNr)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (dateFrom !== undefined) {
                localVarQueryParameter['dateFrom'] = dateFrom;
            }

            if (dateTo !== undefined) {
                localVarQueryParameter['dateTo'] = dateTo;
            }

            if (language !== undefined) {
                localVarQueryParameter['language'] = language;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Returns municipalities of the given canton
         * @param {string} canton two-char canton abbreviation
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cantonsCantonMunicipalitiesGet: async (canton: string, language?: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'canton' is not null or undefined
            assertParamExists('cantonsCantonMunicipalitiesGet', 'canton', canton)
            const localVarPath = `/cantons/{canton}/municipalities/`
                .replace(`{${"canton"}}`, encodeURIComponent(String(canton)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (language !== undefined) {
                localVarQueryParameter['language'] = language;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Municipalities with corona and geo-information
         * @summary Returns municipalities and their corona- and geo-information where the given waypoints lay in.
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {Array<CoordinateDTO>} [waypoints] Array of waypoints from route
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        waypointsPost: async (language?: string, waypoints?: Array<CoordinateDTO>, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/waypoints/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (language !== undefined) {
                localVarQueryParameter['language'] = language;
            }


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(waypoints, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Returns incidences of the given canton with given date filter
         * @param {string} canton two-char canton abbreviation
         * @param {string} [dateFrom] dateFrom - dateFrom is inclusive. If not given, all datasets since beginning.
         * @param {string} [dateTo] dateTo - dateTo is inclusive. If not given, all datasets till today.
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async cantonsCantonIncidencesGet(canton: string, dateFrom?: string, dateTo?: string, language?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<IncidenceDTO>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.cantonsCantonIncidencesGet(canton, dateFrom, dateTo, language, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Returns municipality of the given canton and bfs-nr
         * @param {string} canton two-char canton abbreviation
         * @param {string} bfsNr bfsNr
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async cantonsCantonMunicipalitiesBfsNrGet(canton: string, bfsNr: string, language?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<MunicipalityMetadataDTO>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.cantonsCantonMunicipalitiesBfsNrGet(canton, bfsNr, language, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Returns incidences of the given canton and bfs-nr with given date filter
         * @param {string} canton two-char canton abbreviation
         * @param {string} bfsNr bfsNr
         * @param {string} [dateFrom] dateFrom - dateFrom is inclusive. If not given, all datasets since beginning.
         * @param {string} [dateTo] dateTo - dateTo is inclusive. If not given, all datasets till today.
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async cantonsCantonMunicipalitiesBfsNrIncidencesGet(canton: string, bfsNr: string, dateFrom?: string, dateTo?: string, language?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<IncidenceDTO>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.cantonsCantonMunicipalitiesBfsNrIncidencesGet(canton, bfsNr, dateFrom, dateTo, language, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Returns municipalities of the given canton
         * @param {string} canton two-char canton abbreviation
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async cantonsCantonMunicipalitiesGet(canton: string, language?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<MunicipalityMetadataDTO>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.cantonsCantonMunicipalitiesGet(canton, language, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Municipalities with corona and geo-information
         * @summary Returns municipalities and their corona- and geo-information where the given waypoints lay in.
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {Array<CoordinateDTO>} [waypoints] Array of waypoints from route
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async waypointsPost(language?: string, waypoints?: Array<CoordinateDTO>, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<MunicipalityDTO>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.waypointsPost(language, waypoints, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DefaultApiFp(configuration)
    return {
        /**
         * 
         * @summary Returns incidences of the given canton with given date filter
         * @param {string} canton two-char canton abbreviation
         * @param {string} [dateFrom] dateFrom - dateFrom is inclusive. If not given, all datasets since beginning.
         * @param {string} [dateTo] dateTo - dateTo is inclusive. If not given, all datasets till today.
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cantonsCantonIncidencesGet(canton: string, dateFrom?: string, dateTo?: string, language?: string, options?: any): AxiosPromise<Array<IncidenceDTO>> {
            return localVarFp.cantonsCantonIncidencesGet(canton, dateFrom, dateTo, language, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Returns municipality of the given canton and bfs-nr
         * @param {string} canton two-char canton abbreviation
         * @param {string} bfsNr bfsNr
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cantonsCantonMunicipalitiesBfsNrGet(canton: string, bfsNr: string, language?: string, options?: any): AxiosPromise<MunicipalityMetadataDTO> {
            return localVarFp.cantonsCantonMunicipalitiesBfsNrGet(canton, bfsNr, language, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Returns incidences of the given canton and bfs-nr with given date filter
         * @param {string} canton two-char canton abbreviation
         * @param {string} bfsNr bfsNr
         * @param {string} [dateFrom] dateFrom - dateFrom is inclusive. If not given, all datasets since beginning.
         * @param {string} [dateTo] dateTo - dateTo is inclusive. If not given, all datasets till today.
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cantonsCantonMunicipalitiesBfsNrIncidencesGet(canton: string, bfsNr: string, dateFrom?: string, dateTo?: string, language?: string, options?: any): AxiosPromise<Array<IncidenceDTO>> {
            return localVarFp.cantonsCantonMunicipalitiesBfsNrIncidencesGet(canton, bfsNr, dateFrom, dateTo, language, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Returns municipalities of the given canton
         * @param {string} canton two-char canton abbreviation
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cantonsCantonMunicipalitiesGet(canton: string, language?: string, options?: any): AxiosPromise<Array<MunicipalityMetadataDTO>> {
            return localVarFp.cantonsCantonMunicipalitiesGet(canton, language, options).then((request) => request(axios, basePath));
        },
        /**
         * Municipalities with corona and geo-information
         * @summary Returns municipalities and their corona- and geo-information where the given waypoints lay in.
         * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
         * @param {Array<CoordinateDTO>} [waypoints] Array of waypoints from route
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        waypointsPost(language?: string, waypoints?: Array<CoordinateDTO>, options?: any): AxiosPromise<Array<MunicipalityDTO>> {
            return localVarFp.waypointsPost(language, waypoints, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @summary Returns incidences of the given canton with given date filter
     * @param {string} canton two-char canton abbreviation
     * @param {string} [dateFrom] dateFrom - dateFrom is inclusive. If not given, all datasets since beginning.
     * @param {string} [dateTo] dateTo - dateTo is inclusive. If not given, all datasets till today.
     * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public cantonsCantonIncidencesGet(canton: string, dateFrom?: string, dateTo?: string, language?: string, options?: any) {
        return DefaultApiFp(this.configuration).cantonsCantonIncidencesGet(canton, dateFrom, dateTo, language, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Returns municipality of the given canton and bfs-nr
     * @param {string} canton two-char canton abbreviation
     * @param {string} bfsNr bfsNr
     * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public cantonsCantonMunicipalitiesBfsNrGet(canton: string, bfsNr: string, language?: string, options?: any) {
        return DefaultApiFp(this.configuration).cantonsCantonMunicipalitiesBfsNrGet(canton, bfsNr, language, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Returns incidences of the given canton and bfs-nr with given date filter
     * @param {string} canton two-char canton abbreviation
     * @param {string} bfsNr bfsNr
     * @param {string} [dateFrom] dateFrom - dateFrom is inclusive. If not given, all datasets since beginning.
     * @param {string} [dateTo] dateTo - dateTo is inclusive. If not given, all datasets till today.
     * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public cantonsCantonMunicipalitiesBfsNrIncidencesGet(canton: string, bfsNr: string, dateFrom?: string, dateTo?: string, language?: string, options?: any) {
        return DefaultApiFp(this.configuration).cantonsCantonMunicipalitiesBfsNrIncidencesGet(canton, bfsNr, dateFrom, dateTo, language, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Returns municipalities of the given canton
     * @param {string} canton two-char canton abbreviation
     * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public cantonsCantonMunicipalitiesGet(canton: string, language?: string, options?: any) {
        return DefaultApiFp(this.configuration).cantonsCantonMunicipalitiesGet(canton, language, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Municipalities with corona and geo-information
     * @summary Returns municipalities and their corona- and geo-information where the given waypoints lay in.
     * @param {string} [language] language tag (RFC 4646 format language_code-COUNTRY_CODE, e.g. \&quot;en-US\&quot;)
     * @param {Array<CoordinateDTO>} [waypoints] Array of waypoints from route
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public waypointsPost(language?: string, waypoints?: Array<CoordinateDTO>, options?: any) {
        return DefaultApiFp(this.configuration).waypointsPost(language, waypoints, options).then((request) => request(this.axios, this.basePath));
    }
}


