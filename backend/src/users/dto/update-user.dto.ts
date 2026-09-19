export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  birthday?: string;
  phoneNumber?: string;
  emergencyContact?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    relationship: string;
  };
}
