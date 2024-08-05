import connectDB from "@/lib/dbConnect";
import User from "@/model/User";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function GET(req) {
  await connectDB();
  console.log("connected");
  const session = await auth();
  const user = session?.user;
//   console.log(user)

  if(!session || !session.user){
      return NextResponse.json({message:"not authenticated",success:false})
  }

  const username = user.username;
  try {
    const user = await User.aggregate([
      {
        $match: {
          username: username,
        },
      },
      {
        $unwind: {
          path: "$messages",
        },
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: null,
          messages: {
            $push: "$messages",
          },
        },
      },
    ]).exec();
    if (!user) {
      return NextResponse.json({ message: "User not found.", success: false });
    } else {
      // console.log("got msg", user);
      return NextResponse.json({ message: user[0].messages, success: true });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ message: "can't get messages", success: true });
  }
}
