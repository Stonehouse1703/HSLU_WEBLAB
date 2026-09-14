export class RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday?: string;
  phoneNumber?: string;
  emergencyContact?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    relationship: string;
  };
}
