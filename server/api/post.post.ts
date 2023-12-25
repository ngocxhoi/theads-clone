import { prisma } from "../prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await prisma.posts.create({
    data: {
      userId: body.userId,
      name: body.name,
      image: body.image,
      text: body.text,
      picture: body.picture,
    },
  });
});
