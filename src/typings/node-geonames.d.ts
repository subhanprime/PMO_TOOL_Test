// typings/node-geonames.d.ts
declare module "node-geonames" {
  export interface GeonamesOptions {
    username: string;
    lan?: string;
    encoding?: string;
  }

  export interface SearchOptions {
    q?: string;
    name?: string;
    name_equals?: string;
    maxRows?: number;
    startRow?: number;
    country?: string;
    countryBias?: string;
    adminCode1?: string;
    adminCode2?: string;
    adminCode3?: string;
    featureClass?: string;
    featureCode?: string;
    style?: string;
    fuzzy?: number;
    cities?: string;
  }

  export interface GeoName {
    geonameId: number;
    name: string;
    lat: string;
    lng: string;
    countryCode: string;
    countryName: string;
    adminCode1: string;
    adminName1: string;
    adminCode2: string;
    adminName2: string;
    adminCode3: string;
    adminName3: string;
    population: number;
    elevation: number;
    dem: number;
    timezone: string;
    modificationDate: string;
  }

  export interface SearchResponse {
    totalResultsCount: number;
    geonames: GeoName[];
  }

  export default class Geonames {
    constructor(options: GeonamesOptions);
    search(options: SearchOptions): Promise<SearchResponse>;
  }
}
