import { TriggerClient } from "@trigger.dev/sdk"
import { exampleJob } from "../jobs/example"

import { AppBindings } from "../types/AppBindings"
import { assistantJob } from "../jobs/assistant"

export const trigger = (env: AppBindings) => {
  const client = new TriggerClient({
    id: "ragdoll",
    apiKey: env.TRIGGER_API_KEY,
    apiUrl: env.TRIGGER_API_URL,
  })

  exampleJob(client)
  assistantJob({ client, env })

  return client
}
