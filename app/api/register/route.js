import { User } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { firstName, lastName, email, password, userRole } =
    await request.json();

  console.log(firstName, lastName, email, password, userRole);

  await dbConnect();

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: userRole,
  };

  try {
    const user = await User.create(newUser);
    return new NextResponse("User has been created", {
      status: 201,
    });
  } catch (error) {
    return new  NextResponse(error.message, {
      status: 500,
    });
  }
}
