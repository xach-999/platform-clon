import {customErrors} from "./errorObject"

class CustomErrorClass extends Error {
  constructor(message: `${customErrors}`) {
    super(message)
    this.name = "CustomErrorClass"
  }
}

export default CustomErrorClass
