import { prisma } from "../prisma";

export default defineEventHandler(async (event) => {
  return await prisma.posts.findMany({
    orderBy: { id: "desc" },
    include: { likes: true },
  });
});
