import { jest } from '@jest/globals';

// helper to create a fake res object
function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  return res;
}

describe('routesController.getProfile', () => {
  afterEach(() => jest.resetModules());

  test('sends success response when service returns a fact', async () => {
    await jest.unstable_mockModule('../src/services/catFactService.js', () => ({
      __esModule: true,
      default: async () => 'A sample cat fact'
    }));

    const res = createRes();
    const req = {};
    const { getProfile: gp } = await import('../src/controllers/routesController.js');
    await gp(req, res, () => {});

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const body = res.json.mock.calls[0][0];
    expect(body.status).toBe('success');
    expect(body.fact).toBe('A sample cat fact');
  });

  test('calls next with ApiError when service fails', async () => {
    await jest.unstable_mockModule('../src/services/catFactService.js', () => ({
      __esModule: true,
      default: async () => { throw new Error('Upstream failure'); }
    }));

    const res = createRes();
    const req = {};
    const next = jest.fn();
    const { getProfile: gp } = await import('../src/controllers/routesController.js');
    await gp(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeDefined();
    expect(err.message).toBe('Failed to fetch profile data');
  });
});
