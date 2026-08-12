export interface driver{
  "driverId": number,
    "driverName": string,
    "dob": string,
    "phoneNumber": string,
    "altPhoneNumber": string,
    "address": string,
    "aadharNumber": string,
    "panNumber": string,
    "licence": string,
    "image": string,
    "qualification": string,
    "status": null,
    "isVerified": boolean,
    "vehicleTypeIds": string,
    "vechileTypeList": [
      {
        "vehicleTypeName": string
      }
    ],
    "transmissionTypeId": number,
    "transmissionTypeName": string,
    "experiance": number,
    "ratingId": number,
    "currentLocation": string,
    "verificationStatusIds": string,
    "verificationStatuses": [
      {
        "verificationStatusId": number,
        "verificationStatusName": string
      }
    ],
    "verifiedDate": Date,
    "noOfTripsCount": number,
    "referedBy": number,
    "approvedBy": number
}