import { Schema, model,Document } from "mongoose";

export type TUser = {
    name:string,
    email: string;
    password: string;
    confirmPassword?:string,
    otp?:string | null,
    isActive: boolean;
    role?: string | null;
};

export interface IUser extends TUser, Document {}

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role:{
        type:String,
        default:null
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: false,
    },
    otp: {
        type: String,
        required: false,
        default:null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true, // This enables the timestamps option
});

const User = model<IUser>("User", userSchema)

export default User;