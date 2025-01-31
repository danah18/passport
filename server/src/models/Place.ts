import { Schema, model, Document } from 'mongoose';

export interface IPlace extends Document {
    name: string;
    description?: string;
    category?: string;
    address?: string;
    // trip: Types.ObjectId
}

const placeSchema = new Schema<IPlace>(
    {
        name: { type: String, required: true },
        description: { type: String },
        category: { type: String },
        address: { type: String },
    },
    { timestamps: true }
);

export default model<IPlace>('Place', placeSchema);