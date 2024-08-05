import connectDB from "@/lib/dbConnect";
import User from "@/model/User";
import { NextResponse } from "next/server";
import { auth } from "@/auth";  

export async function POST(req) {
  await connectDB();

  const session = await auth();
  const user = session?.user;

  if (!session || !session.user) {
    return NextResponse.json({ message: "not authenticated", success: false });
  }

  const username = user.username;
  let payload = await req.json();
  let { acceptMessage } = payload;

  try {
    console.log("this is try block")
    let updatedUser = await User.findOneAndUpdate({
      username,
      isAcceptingMessages: acceptMessage,
      new: true, //return new modified document ---> request to mongoose
    });
    console.log("this is user new : ",updatedUser)
    if (!updatedUser) {
      return NextResponse.json({ message: "user not found", success: false });
    } else {
      return NextResponse.json({
        updatedUser,
        message: "Message acceptance status updated successfully",
        success: true,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to make user accept message", success: false },
      { status: 504 }
    );
  }
}

export async function GET(req) {
  await connectDB();

  const session = await auth();
  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json({ message: "not authenticated", success: false });
  } else {
    try {
      let username = user.username;

      let foundUser = await User.findOne({ username });
      if (!foundUser) {
        return NextResponse.json({
          message: "User not found,Kindly signup",
          success: false,
        });
      } else {
        return NextResponse.json({
          isAcceptingMessages: foundUser.isAcceptingMessages,
          success: true,
        });
      }
    } catch (error) {
      console.log(error)
      return NextResponse.json({message:"Failed to get the accepting message status of the user",success:false})
    }
  }
}

// export async function GET(req) {
//   await connectDB();

//   // const session = await auth();
//   // const user = session?.user;

//   // if (!session || !session.user) {
//   //   return NextResponse.json({ message: "not authenticated", success: false });
//   // }

//   // const userId = user._id;

//   let payload =await req.json();
//   // let { username} = payload;
//   console.log(payload)
//   try {

//     let foundUser = await User.findOne({ username });
//     if (!foundUser) {
//       return NextResponse.json({ message: "User not found", success: false });
//     } else {
//       return NextResponse.json({
//         isAcceptingMessages: foundUser.isAcceptingMessages,
//         success: true,
//       });
//     }
//   } catch (error) {
//     return NextResponse.json(
//         { message: "Failed to get user message acceptance status", success: false },
//         { status: 504 }
//         );
//   }
// }
