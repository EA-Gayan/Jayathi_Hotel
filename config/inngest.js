import { Inngest } from "inngest";
import dbConnect from "../config/db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "jh-restaurent" });

//inngest function to save user data to db
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  { event: "clerk/user-created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      name: first_name + "" + last_name,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    };
    console.log("userData", userData);
    await dbConnect();
    await User.create(userData);
  }
);

//inngest function to update user data to db
export const syncUserUpdate = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  { event: "clerk/user-updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      name: first_name + "" + last_name,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    };
    await dbConnect();
    await User.findByIdAndUpdate(id, userData);
  }
);

//inngest function to delete user data from db
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
  },
  { event: "clerk/user-deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await dbConnect();
    await User.findByIdAndDelete(id);
  }
);
