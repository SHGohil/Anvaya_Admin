export interface Trips {
    tripId: number;
    driverId: number | null;
    fromTime: string;
    toTime: string;
    pickupLocation: string;
    dropLocation: string;
    tripTypeName: string;
    hours: number;
    vehicleTypeName: string;
    transmissionTypeName: string;
    totalTripValue: string;
    istripcompleted: boolean;
    paymentType: string | null;
    distance: number | null;
  };

  export interface Tripscat {
    tripTypeId: number;
    tripName: string;
    tripDescription: string;
    icon: string;
  }

  export interface Tripstatus {
    tripStatusId: number,
    tripStatusName: string;
  }