import { GameBase, GameBtnPayload } from './game';

export class WangTingYuGame extends GameBase {
  public static readonly RefId = "exogof";
  private assets = {
    image1: "823477618099021", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/Ting-Yu+Wang/wang-1.png
    image2: "462934301076158", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/Ting-Yu+Wang/wang-2.png
    image3: "488778088664029", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/Ting-Yu+Wang/wang-3.png
    image4: "755467104974997", // https://ustw-messenger-bot-assets.s3-us-west-2.amazonaws.com/Ting-Yu+Wang/wang-4.png
    video: "1022241531470946"
  };

  constructor(sendMessageAPI: (sender_psid: string, payload: any) => void) {
    super(sendMessageAPI);
  }

  triggerGameByMessage(sender_psid: string, text: string): boolean {
    const s = text.toLowerCase();
    if (s.includes("王定宇") || s.includes("定宇")) {
      this.handleReferral(sender_psid);
      return true;
    }
    return false;
  }

  async handleReferral(sender_psid: string) {
    await this.sendImage(sender_psid, { attachment_id: this.assets.image1 });
    await this.sendTextMessage(
      sender_psid,
      "這次的影片內容足足有40分鐘，看完是不是覺得很紮實呢！我們自己在採訪時，真的也是差點一邊訪問，一邊抄筆記XD"
    );
    await this.sendTextMessage(
      sender_psid,
      "現在輪到你了👉🏻，觀測站要給你一個小測驗，總共五題，若能全部答對，就能解鎖隱藏影片。"
    );
    await this.sendCard(sender_psid, {
      text: "想知道王定宇委員會推薦台灣些人事物給美國人嗎？",
      buttons: [
        {
          title: "我想知道，我接受挑戰！",
          payload: { refId: WangTingYuGame.RefId, questionId: 0, answer: true }
        },
        {
          title: "台南立委一定推薦台南啊，我接受挑戰（咦XD）！",
          payload: { refId: WangTingYuGame.RefId, questionId: 0, answer: true }
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
          await this.sendTextMessage(sender_psid, "好喔～既然那麼堅持的話，第一題要來囉。");
          await this.sendCard(sender_psid, {
            text: "王委員在影片開始有提到台灣目前民主政治的三個問題，請問「不」包含下列哪一個？",
            buttons: [
              {
                title: "假錯消息",
                payload: {
                  refId: WangTingYuGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "經濟衰退",
                payload: {
                  refId: WangTingYuGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              },
              {
                title: "國家認同",
                payload: {
                  refId: WangTingYuGame.RefId,
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
            "答對了！不錯喔～"
          );
          await this.sendTextMessage(sender_psid, "接著是第二題");
          await this.sendCard(sender_psid, {
            text: "請問，在談到美國對台灣的角色時，王委員認為可以用兩個字總結，請問是？？",
            buttons: [
              {
                title: "安全",
                payload: {
                  refId: WangTingYuGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              },
              {
                title: "有錢",
                payload: {
                  refId: WangTingYuGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "幸福",
                payload: {
                  refId: WangTingYuGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              }
            ]
          });
          break;

        case 2:
          await this.sendTextMessage(
            sender_psid,
            "是的，王委員認為目前美國對台的一個重要角色就是提供「安全感」，而這反映在美國對台灣在外交、國防上的協助。"
          );
          await this.sendTextMessage(
            sender_psid,
            "但接下來的題目會越來越有挑戰性，準備好了嗎？"
          );
          await this.sendCard(sender_psid, {
            text:
              "第三題，請問，在問到對美國國會的期待時，王委員認為哪個優先順序較重要？",
            buttons: [
              {
                title: "提出更多友台法案",
                payload: {
                  refId: WangTingYuGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "落實已經通過的友台法案",
                payload: {
                  refId: WangTingYuGame.RefId,
                  questionId: nextQId,
                  answer: true
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
            "你真的很認真看欸，好，我要來出難題了。"
          );
          await this.sendCard(sender_psid, {
            text:
              "下面哪一個「不是」王定宇委員認為台灣重要的原因？",
            buttons: [
              {
                title: "台灣在南海的太平島蘊含豐富的石油資源",
                payload: {
                  refId: WangTingYuGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              },
              {
                title: "東亞四大危機中，有三個都跟台灣直接相關",
                payload: {
                  refId: WangTingYuGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "台灣是高科技產業界的阿拉伯王國",
                payload: {
                  refId: WangTingYuGame.RefId,
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
            "哇，連這題都難不倒你，終於剩下最後一題了。"
          );
          await this.sendCard(sender_psid, {
            text: "委員在影片中被問到對美國的印象時，請問他最有印象的是什麼？",
            buttons: [
              {
                title: "飯店演講廳",
                payload: {
                  refId: WangTingYuGame.RefId,
                  questionId: nextQId,
                  answer: true
                }
              },
              {
                title: "金門大橋",
                payload: {
                  refId: WangTingYuGame.RefId,
                  questionId: nextQId,
                  answer: false
                }
              },
              {
                title: "自由女神像",
                payload: {
                  refId: WangTingYuGame.RefId,
                  questionId: nextQId,
                  answer: false
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
            "按照約定，我就奉上王委員的隱藏影片，來看看他想推薦台灣的哪些東西給美國人吧。"
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
            "最後，就像委員說的，即便美國對我們很重要，台灣的外交國防還是要靠自己，台灣人要團結並凝聚共識才是現下我們所遭遇困境的正解。台灣其實很有實力，而且對區域甚至是世界，都有很重要的價值，台灣人不要妄自菲薄，自己國家的未來我們自己掌握。明年1月的選舉非常重要。觀測站也要在這裡拜託大家，把握手中珍貴的一票，記得明年的1月11日要記得去投票！🗳️"
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
            payload: { refId: WangTingYuGame.RefId, questionId: 0, answer: true }
          }
        ]
      });
    }
  }
}
