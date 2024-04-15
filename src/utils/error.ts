type MessageObject = {
  [key: string]: string | MessageObject;
};

export function getMessages(obj: MessageObject, path: string = ''): string[] {
  let messages: string[] = [];
  for (const key in obj) {
    const newPath = path ? `${path}.${key}` : key;
    if (key === 'message') {
      messages.push(`${newPath}: ${obj[key]}`);
    } else if (typeof obj[key] === 'object') {
      messages = messages.concat(getMessages(obj[key] as MessageObject, newPath));
    }
  }
  return messages;
}
