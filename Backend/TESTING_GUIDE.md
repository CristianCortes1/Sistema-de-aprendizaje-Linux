# 🧪 Guía de Pruebas Unitarias - PenguinPath

## 📋 Índice
1. [Introducción](#introducción)
2. [Estructura de las Pruebas](#estructura-de-las-pruebas)
3. [Cómo Funcionan los Tests](#cómo-funcionan-los-tests)
4. [Ejemplos Detallados](#ejemplos-detallados)
5. [Ejecutar las Pruebas](#ejecutar-las-pruebas)
6. [Mejores Prácticas](#mejores-prácticas)

## 📚 Introducción

Las pruebas unitarias verifican que cada componente de tu aplicación funciona correctamente de forma aislada. En NestJS usamos:

- **Jest**: Framework de testing
- **@nestjs/testing**: Utilidades para testing en NestJS
- **Mocks**: Simulan dependencias sin ejecutarlas realmente

## 🏗️ Estructura de las Pruebas

### Archivos Creados

```
src/
├── auth/
│   ├── auth.controller.spec.ts   ✅ Tests del controlador
│   ├── auth.service.spec.ts      ✅ Tests del servicio
│   ├── auth.controller.ts
│   └── auth.service.ts
└── users/
    ├── users.controller.spec.ts  ✅ Tests del controlador
    ├── users.service.spec.ts     ✅ Tests del servicio
    ├── users.controller.ts
    └── users.service.ts
```

### Patrón de Nombre

- Archivo original: `users.service.ts`
- Archivo de test: `users.service.spec.ts`

## 🔍 Cómo Funcionan los Tests

### 1. Configuración Inicial (beforeEach)

```typescript
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UsersService,              // Servicio a probar
      {
        provide: PrismaService,  // Dependencia mockeada
        useValue: mockPrismaService,
      },
    ],
  }).compile();

  service = module.get<UsersService>(UsersService);
  prismaService = module.get<PrismaService>(PrismaService);
  
  jest.clearAllMocks();  // Limpiar mocks antes de cada test
});
```

**¿Qué hace esto?**
- Crea un módulo de testing aislado
- Inyecta el servicio real que queremos probar
- Inyecta versiones "falsas" (mocks) de las dependencias
- Limpia los mocks para que cada test empiece limpio

### 2. Mocks (Simulaciones)

```typescript
const mockPrismaService = {
  user: {
    create: jest.fn(),      // Función simulada
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};
```

**¿Por qué usar mocks?**
- ✅ No acceden a la base de datos real
- ✅ Son rápidos (milisegundos)
- ✅ Controlamos exactamente qué devuelven
- ✅ No hay efectos secundarios

### 3. Estructura de un Test

```typescript
describe('NombreDelComponente', () => {
  describe('nombreDelMetodo', () => {
    it('should hacer algo específico', async () => {
      // 1. ARRANGE: Preparar datos y mocks
      const input = { username: 'test' };
      const expectedOutput = { id: 1, username: 'test' };
      mockService.method.mockResolvedValue(expectedOutput);
      
      // 2. ACT: Ejecutar el método a probar
      const result = await service.method(input);
      
      // 3. ASSERT: Verificar el resultado
      expect(result).toEqual(expectedOutput);
      expect(mockService.method).toHaveBeenCalledWith(input);
      expect(mockService.method).toHaveBeenCalledTimes(1);
    });
  });
});
```

## 💡 Ejemplos Detallados

### Ejemplo 1: Test de Servicio (UsersService.create)

```typescript
describe('create', () => {
  it('should create a new user', async () => {
    // 1. ARRANGE - Preparar datos de entrada
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    // Datos que esperamos que devuelva Prisma
    const expectedUser = {
      id_Usuario: 1,
      username: 'testuser',
      correo: 'test@example.com',
      experiencia: 0,
      createdAt: new Date(),
    };

    // Configurar el mock para que devuelva estos datos
    mockPrismaService.user.create.mockResolvedValue(expectedUser);

    // 2. ACT - Ejecutar el método
    const result = await service.create(createUserDto);

    // 3. ASSERT - Verificar resultados
    expect(result).toEqual(expectedUser);
    expect(mockPrismaService.user.create).toHaveBeenCalledWith({
      data: {
        username: createUserDto.username,
        correo: createUserDto.email,
        contraseña: createUserDto.password,
      },
    });
  });
});
```

**Explicación paso a paso:**

1. **ARRANGE (Preparar)**:
   - Creamos los datos de entrada (`createUserDto`)
   - Definimos qué esperamos que devuelva (`expectedUser`)
   - Configuramos el mock con `mockResolvedValue`

2. **ACT (Actuar)**:
   - Llamamos al método que queremos probar
   - En este caso: `service.create(createUserDto)`

3. **ASSERT (Verificar)**:
   - Verificamos que el resultado sea correcto
   - Verificamos que Prisma fue llamado con los parámetros correctos
   - Verificamos que fue llamado solo una vez

### Ejemplo 2: Test de Controlador (UsersController.findOne)

```typescript
describe('findOne', () => {
  it('should return a single user', async () => {
    // ARRANGE
    const userId = '1';
    const expectedUser = {
      id_Usuario: 1,
      username: 'testuser',
    };

    mockUsersService.findOne.mockResolvedValue(expectedUser);

    // ACT
    const result = await controller.findOne(userId);

    // ASSERT
    expect(result).toEqual(expectedUser);
    expect(service.findOne).toHaveBeenCalledWith(1); // Nota: convierte string a number
  });

  it('should handle non-existent user', async () => {
    // ARRANGE
    mockUsersService.findOne.mockResolvedValue(null);

    // ACT
    const result = await controller.findOne('999');

    // ASSERT
    expect(result).toBeNull();
  });
});
```

**¿Qué estamos probando?**
- ✅ El controlador llama al servicio correcto
- ✅ Convierte el ID de string a number
- ✅ Devuelve lo que el servicio devuelve
- ✅ Maneja casos cuando no encuentra el usuario

### Ejemplo 3: Test con Excepciones (AuthService.validateUser)

```typescript
it('should throw UnauthorizedException when password is invalid', async () => {
  // ARRANGE
  const mockUser = {
    username: 'testuser',
    contraseña: 'hashedPassword',
    activo: true,
  };

  mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
  (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Simular contraseña incorrecta

  // ACT & ASSERT
  await expect(
    service.validateUser('testuser', 'wrongpassword'),
  ).rejects.toThrow(UnauthorizedException);
});
```

**¿Qué hace este test?**
- Simula un usuario existente
- Simula que la contraseña es incorrecta (bcrypt.compare devuelve false)
- Verifica que se lance la excepción correcta

### Ejemplo 4: Test con Lógica Compleja (Login con Racha)

```typescript
it('should increment racha when user logs in next day', async () => {
  // ARRANGE
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const mockUser = {
    id_Usuario: 1,
    username: 'testuser',
    racha: 5,
    ultimoLogin: yesterday,  // Se conectó ayer
  };

  mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
  mockPrismaService.user.update.mockResolvedValue({
    ...mockUser,
    racha: 6,  // Esperamos que la racha aumente
  });

  // ACT
  await service.login(mockUser);

  // ASSERT
  expect(prismaService.user.update).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        racha: 6,  // Verificamos que la racha aumentó
      }),
    }),
  );
});
```

**¿Qué estamos probando?**
- La lógica de negocio de la racha
- Si el usuario se conectó ayer, la racha debe aumentar
- Usamos `expect.objectContaining` para verificar solo los campos importantes

## 🚀 Ejecutar las Pruebas

### Comandos Disponibles

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch (se re-ejecutan al guardar)
pnpm test:watch

# Ejecutar tests con coverage (cobertura)
pnpm test:cov

# Ejecutar solo tests de un archivo
pnpm test users.service.spec

# Ejecutar tests en modo debug
pnpm test:debug
```

### En Docker

```bash
# Ejecutar tests en el contenedor
docker exec -it penguinpath-backend pnpm test

# Con coverage
docker exec -it penguinpath-backend pnpm test:cov

# Modo watch (interactivo)
docker exec -it penguinpath-backend pnpm run test:watch

# Ejecutar tests de un módulo específico
docker exec -it penguinpath-backend pnpm test -- users.service.spec

# Modo debug
docker exec -it penguinpath-backend pnpm test:debug
```

> **Nota**: Si estás dentro del contenedor (`docker exec -it penguinpath-backend sh`), ejecuta directamente:
> ```bash
> pnpm test
> pnpm run test:watch
> pnpm test:cov
> ```

### Salida Esperada

```
PASS  src/users/users.service.spec.ts
  UsersService
    ✓ should be defined (5ms)
    create
      ✓ should create a new user (3ms)
    findAll
      ✓ should return an array of users (2ms)
      ✓ should return empty array when no users exist (2ms)
    findOne
      ✓ should return a user by id (2ms)
      ✓ should return null when user not found (2ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Time:        2.345s
```

## 📊 Coverage (Cobertura)

```bash
pnpm test:cov
```

Esto genera un reporte mostrando qué porcentaje del código está cubierto por tests:

```
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
users.service.ts      |   95.12 |    87.50 |   100.0 |   94.73 |
users.controller.ts   |   100.0 |   100.0  |   100.0 |   100.0 |
auth.service.ts       |   92.45 |    85.71 |   100.0 |   91.89 |
auth.controller.ts    |   100.0 |   100.0  |   100.0 |   100.0 |
```

## ✅ Mejores Prácticas

### 1. Nombres Descriptivos

❌ **Mal:**
```typescript
it('test 1', () => {});
```

✅ **Bien:**
```typescript
it('should create a new user when valid data is provided', () => {});
```

### 2. Un Test = Una Cosa

❌ **Mal:**
```typescript
it('should create and update and delete user', async () => {
  await service.create(dto);
  await service.update(1, updateDto);
  await service.remove(1);
});
```

✅ **Bien:**
```typescript
it('should create a new user', async () => {
  await service.create(dto);
  expect(result).toBeDefined();
});

it('should update an existing user', async () => {
  await service.update(1, updateDto);
  expect(result.username).toBe('updated');
});
```

### 3. Limpiar Mocks

```typescript
beforeEach(() => {
  jest.clearAllMocks();  // Limpiar antes de cada test
});
```

### 4. Probar Casos Felices y Casos de Error

```typescript
describe('findOne', () => {
  // Caso feliz
  it('should return a user when found', async () => {
    // ...
  });

  // Caso de error
  it('should return null when user not found', async () => {
    // ...
  });

  // Caso de error
  it('should handle invalid ID format', async () => {
    // ...
  });
});
```

### 5. Usar expect.objectContaining para Objetos Grandes

```typescript
// En lugar de verificar todo el objeto
expect(result).toEqual({
  id: 1,
  username: 'test',
  // ... muchos más campos
});

// Verifica solo lo importante
expect(result).toEqual(
  expect.objectContaining({
    username: 'test',
    activo: true,
  }),
);
```

## 🎯 Tipos de Assertions

```typescript
// Igualdad
expect(result).toBe(5);                    // Igualdad estricta
expect(result).toEqual({ id: 1 });         // Igualdad de objetos

// Veracidad
expect(result).toBeTruthy();
expect(result).toBeFalsy();
expect(result).toBeNull();
expect(result).toBeUndefined();
expect(result).toBeDefined();

// Números
expect(result).toBeGreaterThan(10);
expect(result).toBeLessThan(100);

// Strings
expect(result).toContain('test');
expect(result).toMatch(/pattern/);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain(item);

// Excepciones
expect(() => service.method()).toThrow();
await expect(service.method()).rejects.toThrow();

// Funciones mockeadas
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
```

## 📝 Resumen de lo Implementado

### Tests Creados

1. **users.service.spec.ts** (203 líneas)
   - ✅ create()
   - ✅ findAll()
   - ✅ findAllForExperience()
   - ✅ findOne()
   - ✅ update()
   - ✅ remove()

2. **users.controller.spec.ts** (160 líneas)
   - ✅ create()
   - ✅ findAll()
   - ✅ getRanking()
   - ✅ findOne()
   - ✅ update()
   - ✅ remove()

3. **auth.service.spec.ts** (280 líneas)
   - ✅ validateUser() - casos felices y errores
   - ✅ login() - con lógica de racha
   - ✅ register() - registro completo
   - ✅ confirmEmail() - confirmación de email

4. **auth.controller.spec.ts** (185 líneas)
   - ✅ register()
   - ✅ login()
   - ✅ confirmEmail()

### Cobertura Total

- **4 archivos** de pruebas completamente implementados
- **28 tests individuales**
- Cubre los casos más importantes (happy path y error cases)

## 🔧 Troubleshooting

### Error: "Cannot find module"

```bash
# Regenerar node_modules
pnpm install
```

### Error: "Test timeout"

```typescript
// Aumentar el timeout
it('should do something slow', async () => {
  // ...
}, 10000); // 10 segundos
```

### Mocks no funcionan

```typescript
// Asegúrate de limpiar los mocks
beforeEach(() => {
  jest.clearAllMocks();
});
```

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Autor**: Sistema de Aprendizaje PenguinPath  
**Fecha**: Octubre 2025  
**Versión**: 1.0
