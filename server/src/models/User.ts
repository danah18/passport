import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    // We can add more fields: password, slug, etc.
}

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export default model<IUser>('User', userSchema);