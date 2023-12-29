import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiOWY5YjI4ZmUtNmJmZS00YTFiLWE3YjktYjcwNGFhNDM3MzE0IiwidGVuYW50X2lkIjoiZTMwMWFkZDMxYjM0ODIyOWFmMzI5MGEzODdlYzM0ZWQ5NmRiMjlmZjJiODBkZTVjNTk3NDY0MjcyNTlhNmJhZCIsImludGVybmFsX3NlY3JldCI6ImFjMTJiMTM3LWI0NTMtNDY0Mi1hYWI4LTVkZDQ0NDQ5ZWI0NyJ9.y594Ddj-X4DAbDCHwYor1rT29CWSMgDMs021BR-eSlg",
    },
  },
}).$extends(withAccelerate())
