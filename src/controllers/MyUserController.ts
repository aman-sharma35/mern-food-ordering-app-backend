import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const currentUser = await User.findOne({ _id: req.userId });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(currentUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const createCurrentUser = async (req: Request, res: Response) => {
    //1. check if the user exist
    //2. create the user if it dosent exist
    //3. return the user object to the calling client

    try {
        const { auth0Id } = req.body;
        const existingUser = await User.findOne({ auth0Id });

        if (existingUser) {
            return res.status(200).send();
        }

        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).json(newUser.toObject()); //what does this toObject does is that it converts a document which will have a bunch of version numbers and extra things in it to a plain old JavaScript object so this is a typical object that we know and that we work with.
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user" }) //status of 500 which means something went wrong and then we'll say Json and then we'll pass in an object
    }
}


const updateCurrentUser = async (req: Request, res: Response) => {
    try {
        const { name, addressLine1, country, city } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name;
        user.addressLine1 = addressLine1;
        user.city = city;
        user.country = country;

        await user.save();

        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating user" });
    }
};


export default {
    getCurrentUser,
    createCurrentUser,
    updateCurrentUser,
};








