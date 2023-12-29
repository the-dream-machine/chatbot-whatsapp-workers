import { whatsappUrl } from "./whatsappUrl"

interface Args {
  chatId: string
  message: string
}

export const waSendMessage = async ({ chatId, message }: Args) => {
  const body = { chatId, message }
  const options = {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  }

  const response = await fetch(`${whatsappUrl}/send-message`, options)
  return JSON.stringify(await response.json())
}
