import { Hono } from "hono"
import { addMiddleware } from "@trigger.dev/hono"
import { trigger } from "./utils/trigger"
import { AppBindings } from "./types/AppBindings"

import WAWebJS from "./types/Whatsapp"

const app = new Hono<{
  Bindings: AppBindings
}>()

addMiddleware(app, (env) => trigger(env))

app.get("/", (c) => c.json("Hello Ragdoll API!"))
app.post("/wa-message-received", async (c) => {
  const { message } = (await c.req.json()) as { message: WAWebJS.Message }
  const event = await trigger(c.env).sendEvent({
    name: "assistant.response",
    payload: { message: message.body },
  })

  return c.json({ event })
})

export default app
