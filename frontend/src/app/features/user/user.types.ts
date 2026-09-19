export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  birthday: string;
  phoneNumber: string;
  emergencyContact: EmergencyContact;
}

export interface EmergencyContact {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  relationship: string;
}