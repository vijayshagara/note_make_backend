import { Request, Response, NextFunction } from "express";
import Notes from "../SchemaModule/notesSchemaModule";
// import User from "../SchemaModule/userSchemaModule";
const CircularJSON = require('circular-json');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


module.exports = {
    addNotes: async (req: any, res: Response, next: NextFunction) => {
         console.log('====', res.locals.user);

        try {
            const userId = res.locals.user;
            // let created_user = await User.findById(userId, "_id name email");
            // if (!created_user) {
            //     return res.status(404).send({ error: 'User not found' });
            // }
            req.body.created_by = new ObjectId(userId);
            console.log('============',req.body);
            
            const addNotes = await Notes.create({ ...req.body });
           return res.status(200).send({ id: addNotes._id });
        } catch (error) {
            console.log("error======",error);
            
           // next(error); // Handle errors appropriately
        }
    },
    allProducts: async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.user
        console.log('userId===', userId.toHexString());

        // const userId = '658bbb107bd54fca6a39d267';
        // const createdBy = new ObjectId(userId);
        
        let limit = 9
        let pageNo = 1
        let skip = 0

        if (req.query) {
            if (req.query.page && Number(req.query.page) > 1) {
                pageNo = Number(req.query.page)
            }
        }

        skip = pageNo * limit - limit
        // skip = (pageNo - 1) * limit;   //it is also working
        try {
            let searchNotes;
            if (req.query && req.query.notes) {
                const name = req.query.notes as string
                if (name.length >= 1) {
                    searchNotes = await Notes.find({ title: { $regex: `^${name}`, $options: 'i' } }, "_id title notes isActive").skip(skip).limit(limit).sort({ title: 'asc' });
                    const jsonString = CircularJSON.stringify(searchNotes);
                    const jsonObject = JSON.parse(jsonString)
                    return res.status(200).send(jsonObject);
                }
            } else {
                const allNotes = await Notes.find({
                   created_by: userId.toHexString()
                }, "_id title notes isActive")
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: 'desc' });
                
                console.log("allNotes ===", allNotes);
                
                return res.status(200).send(allNotes);
            }
        } catch (error) {
            console.log("=====",error);
            
            next(error); // Handle errors appropriately
        }
    },
    singleProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const singleNote = await Notes.findOne(
                { _id: req.params.id },
                "_id title notes "
            );
            return res.status(200).send(singleNote);
        } catch (error) {
            next(error); // Handle errors appropriately
        }
    },
    deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Use the Notes model to delete the product
            const result = await Notes.deleteOne({ _id: req.params.id });

            if (result && result.deletedCount === 1) {
                return res.status(200).send({ msg: 'Note deleted successfully' });
            } else {
                return res.status(404).send({ msg: 'Selected note is not found' });
            }
        } catch (error) {
            // Handle errors appropriately
            next(error);
        }
    },
    updateProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedNotes = await Notes.findOne(
                { _id: req.params.id },
            );
            if (updatedNotes) {
                if (req.body.title) {
                    updatedNotes.title = req.body.title;
                }
                if (req.body.notes) {
                    updatedNotes.notes = req.body.notes;
                }
                await updatedNotes.save(); // Save the updated document to the database
            }

            return res.status(200).send(updatedNotes);
        } catch (error) {
            next(error); // Handle errors appropriately
        }
    },
};
