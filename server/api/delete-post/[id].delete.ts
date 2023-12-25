import { prisma } from "../../prisma";

export default defineEventHandler(async (event) => {
  return await prisma.posts.delete({
    where: { id: Number(event.context.params!.id) },
  });
});
