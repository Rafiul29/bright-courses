const { auth } = require("@/auth");
import { getUserByEmail } from "@/queries/users";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse(`You are not authenticated`, {
      status: 404,
    });
  }

  await dbConnect();
  try {
    const user = await getUserByEmail(session?.user?.email);

    return new NextResponse(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(`Error ${error.message}`, {
      status: 404,
    });
  }
};
