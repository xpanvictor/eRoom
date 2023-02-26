import { jest } from "@jest/globals";

export const req = {};
export const res = {
  json: jest.fn(() => res),
  status: jest.fn(() => res),
};

export const buildReq = (overrides?: Record<string, string>) => ({
  ...req,
  ...overrides,
});

export const buildRes = (overrides?: Record<string, string>) => ({
  ...res,
  ...overrides,
});
export const buildNext = (impl?: () => void) => jest.fn(impl).mockName("next");
