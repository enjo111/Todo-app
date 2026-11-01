// types/express.d.ts
import { UserAttributes } from "../model/user.ts"; // or whatever your user type is

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes; // or your actual user payload type
    }
  }
}

export {}; // needed to make this a module, not a global script