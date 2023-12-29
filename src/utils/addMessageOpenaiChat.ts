import { OpenAI } from "@trigger.dev/openai"
import { IOWithIntegrations } from "@trigger.dev/sdk"

interface Args {
  io: IOWithIntegrations<{ openai: OpenAI }>
  threadId: string
  message: string
}

export const addMessageOpenaiChat = async ({ io, threadId, message }: Args) => {
  // Add new message to existing thread
  const threadMessage = await io.openai.beta.threads.messages.create(
    "add-thread-message",
    threadId,
    { role: "user", content: message }
  )
  io.logger.info("Thread message", { threadMessage })

  const createdRun = await io.openai.beta.threads.runs.create(
    "create-run",
    threadId,
    {
      model: "gpt-3.5-turbo-1106",
      assistant_id: "asst_ZtIHxyRJW9rychDE8Hgeb7Lp",
    }
  )

  io.logger.info("Created run", { createdRun })

  const run = await io.openai.beta.threads.runs.waitForCompletion(
    "wait-for-run",
    threadId,
    createdRun.id
  )

  io.logger.info("Completed run", { run })

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
  io.logger.info("assistant", { message: responseMessage })

  return responseMessage
}
