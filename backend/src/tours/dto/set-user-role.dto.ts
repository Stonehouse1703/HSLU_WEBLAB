import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class SetUserRoleDto {
  @IsString({ message: 'Rolle muss ein Text sein.' })
  @IsNotEmpty({ message: 'Benutzerrolle ist erforderlich.' })
  @IsIn(['admin', 'participant'], {
    message: 'Ungültige Benutzerrolle. Gültige Werte: admin, participant.',
  })
  role: 'admin' | 'participant';
}
