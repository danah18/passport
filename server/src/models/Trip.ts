import { Schema, model, Document, Types } from 'mongoose';

export interface ITrip extends Document {
    name: string;
    description?: string;
    user: Types.ObjectId; // reference to User
    places: Types.ObjectId[]; // array of Place IDs
}

const tripSchema = new Schema<ITrip>(
    {
        name: { type: String, required: true },
        description: { type: String },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        places: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
    },
    { timestamps: true }
);

export default model<ITrip>('Trip', tripSchema);