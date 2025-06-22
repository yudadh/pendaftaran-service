import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

//mengunakan middleware pada prisma untuk logging query
export const prisma = new PrismaClient().$extends({
   query: {
      async $allOperations({ operation, model, args, query }) {
         const start = performance.now();
         const result = await query(args);
         const end = performance.now();
         const time = end - start;
         logger.info(
            `Model: ${model}, Operation: ${operation}, Args: ${JSON.stringify(
               args
            )}, Time: ${time}ms`
         );
         return result;
      },
   },
});
