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

export class FreddyGame extends GameBase {
  public static readonly RefId = "azazer";
  private assets = {
    image1: "1764240567042849", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/freddy-1.png
    image2: "747283842444547", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/freddy-2.png
    image3: "1352724584907657", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/freddy-3.png
    image4: "2187901668182130", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/freddy-4.png
    video: "444508749546861"
  };

  constructor(sendMessageAPI: (sender_psid: string, payload: any) => void) {
    super(sendMessageAPI);
  }

  triggerGameByMessage(sender_psid: string, text: string): boolean {
    const s = text.toLowerCase();
    if (s.includes("freddy") || s.includes("林昶佐") || s.includes("肥迪") || s.includes("飛踢")) {
      this.handleReferral(sender_psid);
      return true;
    }
    return false;
  }

  async handleReferral(sender_psid: string) {
    await this.sendImage(sender_psid, { attachment_id: this.assets.image1 });
    await this.sendTextMessage(
      sender_psid,
      "看完觀測站和林昶佐委員訪談的影片，是不是發掘了委員平時少為人知的一面呢（笑）？"
    );
    await this.sendTextMessage(
      sender_psid,
      "現在，觀測站要給你一個小測驗，總共五題，若能全部答對，就能解鎖隱藏影片。"
    );
    await this.sendCard(sender_psid, {
      text: "想知道肥迪會推薦台灣些人事物給美國人嗎？",
      buttons: [
        {
          title: "好像蠻有趣的",
          payload: { refId: FreddyGame.RefId, questionId: 0, answer: true }
        },
        {
          title: "我想知道，我接受挑戰！",
          payload: { refId: FreddyGame.RefId, questionId: 0, answer: true }
        }
      ]
    });
  }

  async handlePostback(sender_psid: string, payload: GameBtnPayload) {
    if (payload.answer) {
      console.log(`payload = ${JSON.stringify(payload, null, 2)}`);
      const nextQId = payload.questionId + 1;
      switch (payload.questionId) {
        case 0:
          await this.sendTextMessage(sender_psid, "好der~那麼第一題要來囉。");
          await this.sendCard(sender_psid, {
            text: "請問林昶佐委員除了是第九屆立法委員外，還曾在哪個組織服務？",
            buttons: [
              {
                title: "國際人權聯盟",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "世界反酷刑組織",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "國際特赦組織 ",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              }
            ]
          });
          break;

        case 1:
          await this.sendImage(sender_psid, {
            attachment_id: this.assets.image2
          });
          await this.sendTextMessage(
            sender_psid,
            "答對了，肥迪是國際特赦組織台灣分會理事長喔！"
          );
          await this.sendTextMessage(sender_psid, "接著是第二題 ");
          await this.sendCard(sender_psid, {
            text: "請問，在談到為何台灣對美國重要時，下面哪項原因「沒有」提到？",
            buttons: [
              {
                title: "亞太地區有許多西方利益，而台灣角色關鍵",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "台灣是中文資訊輸出的重要國家 ",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "台灣擁有領先國防實力 ",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              }
            ]
          });
          break;

        case 2:
          await this.sendTextMessage(
            sender_psid,
            "厲害喔，看來你真的有認真看影片。"
          );
          await this.sendTextMessage(
            sender_psid,
            "但接下來的題目會越來越有挑戰性，準備好了嗎？"
          );
          await this.sendCard(sender_psid, {
            text:
              "第三題，請問，旨在促進台美之間官方高層互訪的美國法案是下面哪一個？",
            buttons: [
              {
                title: "台灣旅行法",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              },
              {
                title: "台灣保證法",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "台灣關係法",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              }
            ]
          });
          break;

        case 3:
          await this.sendImage(sender_psid, {
            attachment_id: this.assets.image3
          });
          await this.sendTextMessage(
            sender_psid,
            "這都難不倒你，看來真的是要出大絕了。"
          );
          await this.sendCard(sender_psid, {
            text:
              "訪談中肥迪有提到美國近來在官方報告中以國家稱呼台灣，請問，是哪一份報告呢？",
            buttons: [
              {
                title: "美中經濟與安全審查委員會2019報告",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "國防部2019印太戰略報告",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              },
              {
                title: "2019國家情報戰略報告",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              }
            ]
          });
          break;

        case 4:
          await this.sendTextMessage(
            sender_psid,
            "哇，能答出這題不簡單欸，終於剩下最後一題了。"
          );
          await this.sendCard(sender_psid, {
            text: "肥迪在影片中被問到喜歡美國哪個城市，請問是哪一個？",
            buttons: [
              {
                title: "紐約",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "芝加哥",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "西雅圖",
                payload: {
                  refId: FreddyGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              }
            ]
          });
          break;

        case 5:
          await this.sendImage(sender_psid, {
            attachment_id: this.assets.image4
          });
          await this.sendTextMessage(
            sender_psid,
            "太厲害了！居然全部都答對了！👏🏻"
          );
          await this.sendTextMessage(
            sender_psid,
            "按照約定，我就奉上肥迪的隱藏影片，來看看他想推薦台灣的哪些東西給美國人吧。"
          );
          await this.sendVideo(
            sender_psid,
            this.assets.video
          );
          await this.sendTextMessage(
            sender_psid,
            "如果你喜歡這個影片，或是平常觀測站的文章，請幫我們把這些資訊多多和身邊的親朋好友分享。希望透過這些內容，能夠幫助你更了解台美關係。"
          );
          await this.sendTextMessage(
            sender_psid,
            "最後，就像肥迪說到的，這幾年是台灣加強和美、日及其他理念相近國家，情報和安全交流的關鍵時期，明年1月的選舉非常重要。觀測站也要在這裡拜託大家，把握手中珍貴的一票，記得明年的1月11日要記得去投票！🗳️"
          );
          break;
      }
    } else {
      await this.sendTextMessage(
        sender_psid,
        "啊啊啊啊，好可惜，挑戰失敗！影片中好像不是這樣說的耶，趕快再看一次影片找答案吧。"
      );
      await this.sendCard(sender_psid, {
        text: "想再試一次嗎？",
        buttons: [
          {
            title: "讓我再試一次",
            payload: { refId: FreddyGame.RefId, questionId: 0, answer: true }
          }
        ]
      });
    }
  }
}
