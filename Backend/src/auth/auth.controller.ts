<<<<<<< HEAD
<<<<<<< HEAD
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
=======
import { Body, Controller, Post } from '@nestjs/common';
=======
import { Body, Controller, Post, Get, Query } from '@nestjs/common';
>>>>>>> Backend
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(
        @Body() body: { username: string; correo: string; password: string },
    ) {
        return this.authService.register(body.username, body.correo, body.password);
    }

    @Post('login')
    async login(
        @Body() body: { username: string; password: string },
    ) {
        const user = await this.authService.validateUser(body.username, body.password);
        return this.authService.login(user);
    }
<<<<<<< HEAD
>>>>>>> Backend
=======

    @Get('confirm-email')
    async confirmEmail(@Query('token') token: string) {
        const user = await this.authService.confirmEmail(token);
        return {
            message: 'Email confirmed successfully',
            user,
        };
    }

    @Get('test-email')
    async testEmail() {
        try {
            await this.authService.testEmailService();
            return { message: 'Test email sent successfully' };
        } catch (error) {
            return { error: error.message, details: error };
        }
    }
>>>>>>> Backend
}
