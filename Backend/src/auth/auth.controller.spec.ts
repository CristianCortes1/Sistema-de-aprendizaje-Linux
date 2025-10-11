import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
<<<<<<< HEAD
import { AuthService } from './auth.service';
=======
>>>>>>> Backend

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
<<<<<<< HEAD
      providers: [AuthService],
=======
>>>>>>> Backend
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
