import { GameBase, GameBtnPayload } from './game';

export class MiaoPoyaGame extends GameBase {
  public static readonly RefId = "ogatim";
  private assets = {
    image1: "456873471918753", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/Miao/miao-1.png
    image2: "777858519383179", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/Miao/miao-2.png
    image3: "553042988611537", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/Miao/miao-3.png
    image4: "2514160908859391", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/Miao/miao-4.png
    image5: "2507829915979894", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/Miao/miao-5.png
    image6: "1253463794847673", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/Miao/miao-6.png
    video: "768689476971318"
  };

  constructor(sendMessageAPI: (sender_psid: string, payload: any) => void) {
    super(sendMessageAPI);
  }

  triggerGameByMessage(sender_psid: string, text: string): boolean {
    const s = text.toLowerCase();
    if (s.includes("苗博雅") || s.includes("阿苗")) {
      this.handleReferral(sender_psid);
      return true;
    }
    return false;
  }

  async handleReferral(sender_psid: string) {
    await this.sendImage(sender_psid, { attachment_id: this.assets.image1 });
    await this.sendTextMessage(
      sender_psid,
      "平常很少看到苗博雅議員在節目媒體上分享關於她對國際情勢的看法，沒想到阿苗對於台美關係很有想法吧？不知道看完影片後，你是不是也對台美關係了解更多了嗎？"
    );
    await this.sendTextMessage(
      sender_psid,
      "現在觀測站要和你玩個小遊戲，會問你五個問題，若能全部答對，就能解鎖隱藏影片。"
    );
    await this.sendCard(sender_psid, {
      text: "預告中我們提到，阿苗想了一個超讚的方式來推薦美國人來台灣，想知道是什麼嗎？那就接受挑戰吧！",
      buttons: [
        {
          title: "我想知道，我接受挑戰！",
          payload: { refId: MiaoPoyaGame.RefId, questionId: 0, answer: true }
        },
        {
          title: "聽起起來好像很有趣呢",
          payload: { refId: MiaoPoyaGame.RefId, questionId: 0, answer: true }
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
          await this.sendTextMessage(sender_psid, "好喔～那這樣的話，第一題要來囉。");
          await this.sendCard(sender_psid, {
            text: "阿苗在影片開始提到她認為台灣目前民主發展的最大阻礙，請問是下列哪一個？",
            buttons: [
              {
                title: "憲政體制",
                payload: {
                  refId: MiaoPoyaGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              },
              {
                title: "經濟發展遲緩",
                payload: {
                  refId: MiaoPoyaGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "政府貪污腐敗",
                payload: {
                  refId: MiaoPoyaGame.RefId,
                  questionId: nextQId,
                  answer: false
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
            "答對了！阿苗認為台灣目前的憲政體制有（1）權責不明、國會權力太小，以及（2）選舉制度不利健康政黨政治這兩點。"
          );
          await this.sendTextMessage(sender_psid, "接著是第二題");
          await this.sendCard(sender_psid, {
            text: "請問阿苗認為下面哪一個是對台灣最重要的外交關係？",
            buttons: [
              {
                title: "中國",
                payload: {
                  refId: MiaoPoyaGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "日本",
                payload: {
                  refId: MiaoPoyaGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "美國",
                payload: {
                  refId: MiaoPoyaGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              }
            ]
          });
          break;

        case 2:
          await this.sendImage(sender_psid, {
            attachment_id: this.assets.image3
          });  
          await this.sendTextMessage(
            sender_psid,
            "這題簡直就是送分題😝"
          );
          await this.sendTextMessage(
            sender_psid,
            "不然，為什麼我們叫做「美國」國會台灣觀測站呢？"
          );
          await this.sendCard(sender_psid, {
            text:
              "第三題，請問，什麼是阿苗認為台灣對美國來說重要的原因？",
            buttons: [
              {
                title: "台灣是美國農產品重要的進口國",
                payload: {
                  refId: MiaoPoyaGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "獨立自主的台灣是亞太地區和平的關鍵",
                payload: {
                  refId: MiaoPoyaGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              }
            ]
          });
          break;

        case 3:
          await this.sendImage(sender_psid, {
            attachment_id: this.assets.image4
          });
          await this.sendTextMessage(
            sender_psid,
            "你真的很認真看欸，好，我要來出難題了。"
          );
          await this.sendCard(sender_psid, {
            text:
              "面對中國對區域影響力日漸增強，阿苗認為台灣在與盟邦合作時，應先著重哪一點？",
            buttons: [
              {
                title: "強健台灣的經濟實力",
                payload: {
                  refId: MiaoPoyaGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "充實台灣的國防武力",
                payload: {
                  refId: MiaoPoyaGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "提高人民的警覺意識",
                payload: {
                  refId: MiaoPoyaGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              }
            ]
          });
          break;

        case 4:
          await this.sendImage(sender_psid, {
            attachment_id: this.assets.image5
          });  
          await this.sendTextMessage(
            sender_psid,
            "哇，連這題都難不倒你，終於剩下最後一題了。"
          );
          await this.sendCard(sender_psid, {
            text: "在影片最後，阿苗在拓展台美關係上，建議應該往哪個層級努力？",
            buttons: [
              {
                title: "中央聯邦層級",
                payload: {
                  refId: MiaoPoyaGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "地方州、郡、市層級",
                payload: {
                  refId: MiaoPoyaGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              }
            ]
          });
          break;

        case 5:
          await this.sendImage(sender_psid, {
            attachment_id: this.assets.image6
          });
          await this.sendTextMessage(
            sender_psid,
            "你真的有認真看影片！全部都答對了！🥳"
          );
          await this.sendTextMessage(
            sender_psid,
            "按照約定，我就奉上阿苗的隱藏影片㊙️，來看看她發現了哪個絕招說服美國人來台灣。"
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
            "最後，就像阿苗在影片中不斷強調的，雖然我們期待透過盟邦來協助我們的國際處境，但我們台灣人應該先在內部凝聚共識、鞏固自己的國家安全意識，才有辦法說服其他人來幫我們。畢竟，每個國家都是以自己國家的利益考量為最優先，若我們自己都不關心這些國家安全的議題，那其他國家也會覺得沒有必要伸手相助。"
          );
          await this.sendTextMessage(
            sender_psid,
            "展現關心的第一步，就是明年的1月11日出門去投票🗳️。觀測站的小編們機票都買好準備回台灣投票了，那你呢？"
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
            payload: { refId: MiaoPoyaGame.RefId, questionId: 0, answer: true }
          }
        ]
      });
    }
  }
}
