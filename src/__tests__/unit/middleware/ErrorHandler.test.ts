import { jest, describe, expect, test } from "@jest/globals";
import ErrorHandler from "../../../middlewares/errorHandler";

describe("--------Testing the Error handling middleware---------", () => {
  const error = new Error("Some random error!");
  const req = {};
  const res = {
    json: jest.fn(() => res),
    status: jest.fn(() => res),
  };
  const next = jest.fn();

  test("Excuse errors taken care of already!", () => {
    res.headersSent = true;
    ErrorHandler(error, req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
