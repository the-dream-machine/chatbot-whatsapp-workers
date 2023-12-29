import { Job, eventTrigger } from "@trigger.dev/sdk"
import { z } from "zod"
import { TriggerClient } from "@trigger.dev/sdk"

export const exampleJob = (client: TriggerClient) =>
  client.defineJob({
    id: "example-job",
    name: "Example Job",
    version: "0.0.2",
    trigger: eventTrigger({
      name: "example.test",
      schema: z.object({
        name: z.string(),
      }),
    }),
    run: async (payload, io, ctx) => {
      await io.logger.info("Hello world!", { payload })

      return {
        message: "Hello world!",
      }
    },
  })
