import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

<<<<<<< HEAD
export class UpdateUserDto extends PartialType(CreateUserDto) {}
=======
export class UpdateUserDto extends PartialType(CreateUserDto) {
    // All fields are optional for update
    
}
>>>>>>> Backend
