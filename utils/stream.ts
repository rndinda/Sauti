import { StreamChat } from 'stream-chat';

export const streamClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY!
); 