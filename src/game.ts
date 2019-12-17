import * as _ from "lodash";

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export type GameBtnPayload = {
  refId: string;
  questionId: number;
  answer: boolean;
};

export interface Game {
  triggerGameByMessage(sender_psid: string, text: string): boolean;
  handleReferral(sender_psid: string);
  handlePostback(sender_psid: string, payload: GameBtnPayload);
}

type CardMessageArgs = {
  text?: string;
  buttons?: { title: string; payload: GameBtnPayload }[];
  image_url?: string;
};

export abstract class GameBase implements Game {
  abstract triggerGameByMessage(sender_psid: string, text: string): boolean;
  abstract handleReferral(sender_psid: string);
  abstract handlePostback(sender_psid: string, payload: GameBtnPayload);

  constructor(
    private sendMessageAPI: (sender_psid: string, payload: any) => void
  ) {}

  protected async sendTextMessage(sender_psid: string, text: string) {
    this.sendMessageAPI(sender_psid, { text });
    await delay(300);
  }

  protected async sendImage(
    sender_psid: string,
    image: { url?: string; attachment_id?: string }
  ) {
    const response = {
      attachment: {
        type: "image",
        payload: {
          ...(image.url && { url: image.url, is_reusable: true }),
          ...(image.attachment_id && { attachment_id: image.attachment_id })
        }
      }
    };
    this.sendMessageAPI(sender_psid, response);
    await delay(300);
  }

  protected async sendVideo(
    sender_psid: string,
    attachment_id: string
  ) {
    const response = {
      attachment: {
        type: "video",
        payload: {
          attachment_id
        }
      }
    };
    this.sendMessageAPI(sender_psid, response);
    await delay(300);
  }

  protected async sendCard(
    sender_psid: string,
    { text, buttons, image_url }: CardMessageArgs
  ) {
    const response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              ...(text && { title: text }),
              // "subtitle": "Tap a button to answer.",
              ...(image_url && { image_url }),
              ...(buttons && {
                buttons: _.map(buttons, btn => ({
                  type: "postback",
                  title: btn.title,
                  payload: JSON.stringify(btn.payload)
                }))
              })
            }
          ]
        }
      }
    };
    this.sendMessageAPI(sender_psid, response);
    await delay(300);
  }
}

