import { describe, expect, test } from "@jest/globals";
import ErrorHandler from "../../../middlewares/errorHandler";
import { buildNext, buildReq, buildRes } from "../../globals/generate";

describe("--------Testing the Error handling middleware---------", () => {
  const error = new Error("Some random error!");
  const req = buildReq();
  const res = buildRes();
  const next = buildNext();

  test("Excuse errors taken care of already!", () => {
    res.headersSent = true;
    ErrorHandler(error, req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Handle when request hasnt been responded", () => {
    res.headersSent = false;
    ErrorHandler(error, req, res, next);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
  });

  
});
