export interface triptypes{
  tripTypeId?:number;
  tripName:string;
  tripDescription:string;
  pricePerKilometers:number;
}


export interface triptypesbyid
  {
    "tripTypeId": number,
    "tripName": string,
    "tripDescription": string,
    "icon": string,
    "tripvarients": [
      {
        "tripVariantId": number,
        "tripVariantName": string,
        "triptypeId": number,
        "tripTypeName": string,
        "basePrice": number,
        "kilometerLimit": number,
        "nightCharges": number,
        "chargesperMinute": number,
        "pricePerKilometers": number,
        "isTripOneway": Boolean
      }
    ]
  }

  export interface tripvarient{
    "tripVariantId": number,
    "tripVariantName": string,
    "triptypeId": number,
    "tripTypeName": string,
    "basePrice": number,
    "kilometerLimit": number,
    "nightCharges": number,
    "chargesperMinute": number,
    "pricePerKilometers": number,
    "isTripOneway": Boolean
  }
