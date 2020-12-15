// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


// export const URL = 'http://192.168.0.184:8000/';
export const URL = 'http://127.0.0.1:8000/';

export const environment = {
    production: false,
    STORAGE_URL: URL + 'storage/',
    API_URL_AUTHENTICATION: URL + 'api/authentication/',
    API_URL_IGNUG: URL + 'api/ignug/',
    API_URL_ATTENDANCE: URL + 'api/attendance/',
    API_URL_JOB_BOARD: URL + 'api/job_board/',
    API_URL_WEB: URL + 'api/web/',
    API_URL_TEACHER_EVAL: URL + 'api/teacher_eval/',
    API_URL_COMMUNITY: URL + 'api/community/',

    CLIENT_ID: '2',
    CLIENT_SECRET: 'gDBSLhYpj9JTCiAgTt2ILiai6yrZSfxntlb4AVwl',
    GRANT_TYPE: 'password',

    APP_ACRONYM: 'IGNUG',
    APP_NAME: 'SISTEMA DE GESTIÓN ACADÉMICO - ADMINISTRATIVO',
    APP_VERSION: '1.2.1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
