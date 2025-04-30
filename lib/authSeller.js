import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// This function checks if the user is a seller by checking the user's role in Clerk's public metadata.
const authSeller = async (userId) => {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (user.publicMetadata.role === "seller") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
};

export default authSeller;
