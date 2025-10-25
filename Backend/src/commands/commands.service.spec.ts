import { Test, TestingModule } from '@nestjs/testing';
import { CommandsService } from './commands.service';
import { PrismaService } from '../prisma.service';

describe('CommandsService', () => {
  let service: CommandsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    command: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CommandsService>(CommandsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
