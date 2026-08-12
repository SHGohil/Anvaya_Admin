// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Development environment.
//
// This used to point at the production API, so `ng serve` read and wrote live
// data - creating and approving real bookings against the production database.
// It now targets a locally running API. Change the port if you start the API on
// its HTTPS profile (https://localhost:7256/api) instead.
export const environment = {
  production: false,
  backendAPIURL: 'http://localhost:5096/api',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
