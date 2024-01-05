import { eventTrigger } from "@trigger.dev/sdk"
import { z } from "zod"
import { OpenAI } from "@trigger.dev/openai"

import { TriggerClient } from "@trigger.dev/sdk"
import { AppBindings } from "../types/AppBindings"
import { waSendMessage } from "../utils/waSendMessage"
import { waStartTyping } from "../utils/waStartTyping"
import { waStopTyping } from "../utils/waStopTyping"
import { prisma } from "../utils/prisma"
import { ChatStatus } from "@prisma/client"
import { addMessageOpenaiChat } from "../utils/addMessageOpenaiChat"
import { newOpenaiChat } from "../utils/newOpenaiChat"

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
    version: "0.0.5",
    trigger: eventTrigger({
      name: "assistant.response",
      schema: z.object({
        chatId: z.string(),
        message: z.string(),
      }),
    }),
    integrations: { openai },
    run: async (payload, io, ctx) => {
      const chatId = payload.chatId
      const message = payload.message
      const chat = await prisma.chat.findFirst({
        where: { waChatId: chatId, status: ChatStatus.ACTIVE },
        cacheStrategy: { ttl: 0 },
      })

      await io.logger.info("Prisma chat", { chat })

      let responseMessage = ""
      await waStartTyping({ chatId })
      if (chat) {
        responseMessage = await addMessageOpenaiChat({
          io,
          threadId: chat.openaiThreadId,
          message,
        })
      } else {
        responseMessage = await newOpenaiChat({ io, chatId, message })
      }
      await waStopTyping({ chatId })

      const whatsappMessage = await waSendMessage({
        chatId,
        message: responseMessage,
      })
      await io.logger.debug("WhatsApp message", {
        whatsappMessage: JSON.parse(whatsappMessage),
      })

      return { message: responseMessage }
    },
  })

  return job
}
