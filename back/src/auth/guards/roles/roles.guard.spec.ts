import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let module: TestingModule;

  // 1. Definimos la función de ayuda aquí adentro para que sea fácil de encontrar
  const createMockContext = (userRol?: string): ExecutionContext => {
    const mockRequest = {
      user: userRol ? { rol: userRol, nombre: 'Test User' } : undefined,
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
            get: jest.fn(),
            getAll: jest.fn(),
            getAllAndMerge: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('debería estar definido', () => {
    expect(guard).toBeDefined();
  });

  it('debería permitir el acceso si no hay roles requeridos', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const context = createMockContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('debería denegar el acceso si el rol no coincide', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['jefe']);

    const context = createMockContext('cocinero');
    expect(guard.canActivate(context)).toBe(false);
  });

  it('debería permitir el acceso si el rol coincide', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['jefe']);

    const context = createMockContext('jefe');
    expect(guard.canActivate(context)).toBe(true);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });
});
