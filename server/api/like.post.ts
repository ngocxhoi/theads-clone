import { prisma } from "../prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await prisma.likes.create({
    data: {
      userId: body.userId,
      postId: body.postId,
    },
  });
});
