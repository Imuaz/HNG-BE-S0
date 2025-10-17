import axios from 'axios';
import getCatFact from '../src/services/catFactService.js';
import ApiError from '../src/utils/ApiError.js';

jest.mock('axios');

describe('catFactService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns fact when API responds with valid body', async () => {
    axios.get.mockResolvedValue({ data: { fact: 'Cats have five toes on front paws.' } });
    const fact = await getCatFact();
    expect(fact).toBe('Cats have five toes on front paws.');
  });

  test.each([
    ['timeout', { code: 'ECONNABORTED' }, 'CATFACT_TIMEOUT', 504],
    ['no response', { request: {} }, 'CATFACT_NO_RESPONSE', 502],
    ['upstream status', { response: { status: 500 } }, 'CATFACT_UPSTREAM_ERROR', 502]
  ])('throws ApiError on %s', async (_, axiosError, expectedCode, expectedStatus) => {
    axios.get.mockRejectedValue(axiosError);
    await expect(getCatFact()).rejects.toMatchObject(expect.objectContaining({ code: expectedCode, httpStatus: expectedStatus }));
  });
});
