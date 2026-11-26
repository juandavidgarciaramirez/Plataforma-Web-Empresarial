import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() email!: string;
  @ApiProperty() roleId!: string;
  @ApiProperty() roleName!: string;
  @ApiProperty({ type: [String] }) permissions!: string[];
}

export class AuthResponseDto {
  @ApiProperty() accessToken!: string;
  @ApiProperty() refreshToken!: string;
  @ApiProperty({ description: 'Segundos hasta que expira el access token' })
  expiresIn!: number;
  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto;
}
