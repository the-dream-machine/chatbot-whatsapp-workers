import { OpenAI } from "@trigger.dev/openai"
import { IOWithIntegrations } from "@trigger.dev/sdk"
import { prisma } from "./prisma"

interface Args {
  io: IOWithIntegrations<{ openai: OpenAI }>
  message: string
  chatId: string
}

export const newOpenaiChat = async ({ io, message, chatId }: Args) => {
  await io.logger.info("user message", { message })

  // Create and run new thread
  const run = await io.openai.beta.threads.createAndRunUntilCompletion(
    "create-thread",
    {
      model: "gpt-3.5-turbo-1106",
      assistant_id: "asst_ZtIHxyRJW9rychDE8Hgeb7Lp",
      thread: {
        messages: [{ role: "user", content: message }],
      },
    }
  )

  const createdChat = await prisma.chat.create({
    data: { waChatId: chatId, openaiThreadId: run.thread_id },
  })

  await io.logger.debug("Created Chat", { createdChat })

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
    throw new Error("The OpenAI response was an image but we expected text.")
  }

  const responseMessage = content.text.value
  await io.logger.info("assistant", { message: responseMessage })

  return responseMessage
}
