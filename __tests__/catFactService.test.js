import { jest } from '@jest/globals';

describe('catFactService', () => {
  beforeEach(() => jest.resetModules());
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns fact when API responds with valid body', async () => {
    // mock axios module before importing the service
    await jest.unstable_mockModule('axios', () => ({
      __esModule: true,
      default: { get: jest.fn().mockResolvedValue({ data: { fact: 'Cats have five toes on front paws.' } }) }
    }));

    const { default: axios } = await import('axios');
    const { default: getCatFact } = await import('../src/services/catFactService.js');

    const fact = await getCatFact();
    expect(fact).toBe('Cats have five toes on front paws.');
  });

  test.each([
    ['timeout', { code: 'ECONNABORTED' }, 'CATFACT_TIMEOUT', 504],
    ['no response', { request: {} }, 'CATFACT_NO_RESPONSE', 502],
    ['upstream status', { response: { status: 500 } }, 'CATFACT_UPSTREAM_ERROR', 502]
  ])('throws ApiError on %s', async (_, axiosError, expectedCode, expectedStatus) => {
    await jest.unstable_mockModule('axios', () => ({
      __esModule: true,
      default: { get: jest.fn().mockRejectedValue(axiosError) }
    }));

    const { default: getCatFact } = await import('../src/services/catFactService.js');

    await expect(getCatFact()).rejects.toMatchObject(expect.objectContaining({ code: expectedCode, httpStatus: expectedStatus }));
  });
});
