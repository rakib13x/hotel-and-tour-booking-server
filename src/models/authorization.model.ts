import { model, Schema } from "mongoose";
import { IAuthorization } from "../modules/authorization/authorization.interface";

const authorizationSchema = new Schema<IAuthorization>(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Authorization = model<IAuthorization>(
  "Authorization",
  authorizationSchema
);
