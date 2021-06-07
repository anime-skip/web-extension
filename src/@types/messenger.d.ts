type AllMessageTypes = MessageTypes | ParentMessageTypes | RuntimeMessageTypes;

interface AllMessagePayloads
  extends MessagePayloadMap<AllMessageTypes>,
    ParentMessagePayloadMap,
    RuntimeMessagePayloadMap {}

interface AllMessageResponses
  extends MessageResponseMap<AllMessageTypes>,
    ParentMessageResponseMap,
    RuntimeMessageResponseMap {}

//#region Generic Messenger

type MessageTypes = string;

type MessagePayloadMap<K extends MessageTypes> = { [type in K]: any };

type MessageResponseMap<K extends MessageTypes> = { [type in K]: any };

type MessageListener<K extends MessageTypes> = (
  payload: MessagePayloadMap<MessageTypes>[K],
  sender: browser.runtime.MessageSender
) => Promise<MessageResponseMap<MessageTypes>[K]>;

type MessageListenerMap<K extends MessageTypes> = { [type in K]: MessageListener<any> };

//#endregion

//#region Parent Messenger

type ParentMessageTypes = '@anime-skip/inferEpisodeInfo';

interface ParentMessagePayloadMap extends MessagePayloadMap<ParentMessageTypes> {
  '@anime-skip/inferEpisodeInfo': undefined;
}

interface ParentMessageResponseMap extends MessageResponseMap<ParentMessageTypes> {
  '@anime-skip/inferEpisodeInfo': InferredEpisodeInfo;
}

type ParentMessageListener<T extends ParentMessageTypes> = (
  payload: ParentMessagePayloadMap[T],
  sender: browser.runtime.MessageSender
) => Promise<ParentMessageResponseMap[T]>;

type ParentMessageListenerMap = { [type in ParentMessageTypes]: ParentMessageListener<type> };

//#endregion

//#region Runtime Messenger

type RuntimeMessageTypes =
  | '@anime-skip/open-all-settings'
  | '@anime-skip/open-login'
  | '@anime-skip/get-url';

interface RuntimeMessagePayloadMap extends MessagePayloadMap<RuntimeMessageTypes> {
  '@anime-skip/open-all-settings': undefined;
  '@anime-skip/open-login': undefined;
  '@anime-skip/get-url': undefined;
}

interface RuntimeMessageResponseMap extends MessageResponseMap<RuntimeMessageTypes> {
  '@anime-skip/open-all-settings': void;
  '@anime-skip/open-login': void;
  '@anime-skip/get-url': string | undefined;
}

type RuntimeMessageListener<T extends RuntimeMessageTypes> = (
  payload: RuntimeMessagePayloadMap[T],
  sender: browser.runtime.MessageSender
) => Promise<RuntimeMessageResponseMap[T]>;

type RuntimeMessageListenerMap = { [type in RuntimeMessageTypes]: RuntimeMessageListener<type> };

//#endregion
