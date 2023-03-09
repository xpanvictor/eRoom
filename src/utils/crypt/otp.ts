import Joi from "joi";
import ProgrammingError from "../../error/technical/ProgrammingError";

export function validatePin(pin: number, lengthOfNumber: number): boolean {
  const pinSchema = Joi.string().length(lengthOfNumber);
  const { error } = pinSchema.validate(pin);
  return !!error;
}

export function generatePin(lengthOfNumber: number): number {
  const min = 10 ** (lengthOfNumber - 1);
  const max = 10 ** lengthOfNumber;
  const randomFloat = Math.random();
  const pin = Math.round(randomFloat * (max - min) + min);
  const pinIsValid = validatePin(pin, lengthOfNumber);
  if (!pinIsValid) {
    throw new ProgrammingError(`Pin is not of valid length: ${lengthOfNumber}`);
  }
  return pin;
}
