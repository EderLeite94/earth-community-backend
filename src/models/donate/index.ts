import mongoose, { Document, Schema, Types } from 'mongoose';
type ObjectId = Types.ObjectId;

export interface IDonate {
    transactionID: number;
    transaction_amount: number;
    description: string;
    payment_method_id: string;
    payer: {
        user_id: string | null,
        email: string,
        first_name: string,
        last_name: string,
        identification: {
            type: string,
            number: number
        }
    },
    address: {
        zip_code: number,
        street_name: string,
        street_number: string,
        neighborhood: string,
        city: string,
        federal_unit: string
    }
}

export type DonateDocument = IDonate & Document;

const DonateSchema: Schema = new Schema({
    transactionID: { type: Number },
    transaction_amount: { type: String },
    description: { type: String },
    payment_method_id: { type: String },
    payer: {
        user_id: { type: String },
        email: { type: String },
        first_name: { type: String },
        last_name: { type: String },
        identification: {
            type: { type: String },
            number: { type: Number },
        }
    },
    address: {
        zip_code: { type: Number },
        street_name: { type: String },
        street_number: { type: String },
        neighborhood: { type: String },
        city: { type: String },
        federal_unit: { type: String }
    }
});
export interface IDonateithId extends IDonate {
    _id: string;
}

const Donate = mongoose.model<DonateDocument>('Donate', DonateSchema);

export default Donate;