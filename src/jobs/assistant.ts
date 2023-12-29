import { eventTrigger } from "@trigger.dev/sdk"
import { z } from "zod"
import { OpenAI } from "@trigger.dev/openai"

import { TriggerClient } from "@trigger.dev/sdk"
import { AppBindings } from "../types/AppBindings"
import { waSendMessage } from "../utils/waSendMessage"
import { waStartTyping } from "../utils/waStartTyping"
import { waStopTyping } from "../utils/waStopTyping"

interface Args {
  client: TriggerClient
  env: AppBindings
}

export const assistantJob = ({ client, env }: Args) => {
  const openai = new OpenAI({
    id: "openai",
    apiKey: env.OPENAI_API_KEY,
  })

  const job = client.defineJob({
    id: "assistant_generate_response",
    name: "Assistant generate response",
    version: "0.0.3",
    trigger: eventTrigger({
      name: "assistant.response",
      schema: z.object({
        message: z.string(),
      }),
    }),
    integrations: { openai },
    run: async (payload, io, ctx) => {
      const chatId = "254782648721@c.us"

      await waStartTyping({ chatId })

      io.logger.info("user", { message: payload.message })

      const run = await io.openai.beta.threads.createAndRunUntilCompletion(
        "create-thread",
        {
          model: "gpt-3.5-turbo-1106",
          assistant_id: "asst_ZtIHxyRJW9rychDE8Hgeb7Lp",
          thread: {
            messages: [
              {
                role: "user",
                content: payload.message,
              },
            ],
          },
        }
      )

      if (run.status !== "completed") {
        throw new Error(
          `Run finished with status ${run.status}: ${JSON.stringify(
            run.last_error
          )}`
        )
      }

      // List all messages in the thread
      const messages = await io.openai.beta.threads.messages.list(
        "list-messages",
        run.thread_id
      )

      const content = messages[0].content[0]
      if (content.type === "image_file") {
        throw new Error(
          "The OpenAI response was an image but we expected text."
        )
      }

      const responseMessage = content.text.value

      io.logger.info("assistant", { message: responseMessage })

      await waStopTyping({ chatId })
      const whatsappMessage = await waSendMessage({
        chatId,
        message: responseMessage,
      })

      io.logger.debug("WhatsApp message", { whatsappMessage })

      return {
        message: responseMessage,
      }
    },
  })

  return job
}
