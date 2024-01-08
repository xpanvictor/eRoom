import BaseController from "./index";

class GenericController extends BaseController {
  public async execute(): Promise<void> {
    this.next();
  }
}

export default GenericController;
