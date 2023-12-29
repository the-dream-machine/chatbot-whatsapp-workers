import { whatsappUrl } from "./whatsappUrl"

interface Args {
  chatId: string
}

export const waStartTyping = async ({ chatId }: Args) => {
  const body = { chatId }
  const options = {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  }

  const response = await fetch(`${whatsappUrl}/start-typing`, options)
  return JSON.stringify(await response.json())
}
