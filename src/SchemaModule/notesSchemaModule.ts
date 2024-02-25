import { Schema, model, Document } from "mongoose";

export type Product = {
    title: string,
    notes: number,
    isActive: boolean,
    created_by: {}
};

export interface IProduct extends Product, Document {}

const notesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    color:{
        type: String,
        required: true 
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
        // required: true
    }
}, {
    timestamps: true,
});

const Notes = model<Product & Document>('Notes', notesSchema);

// Notes.collection.drop();
export default Notes;
