import TalkTimeLine from "./TalkTimeLine.jsx"
import IsnotSelectUser from "./isnotSelectUser.jsx"
import Profile from "../Settings/Profile.tsx"
import Friends from "../Settings/Friends.tsx"
export default function ChatTalk(props: any) {
  if (props.isSetting) {
    return (
      <>
        <div class="p-talk-chat">
          <div class="p-talk-chat-container">
            {props.settingPage == "profile" &&
              (
                <Profile>
                </Profile>
              )}
            {props.settingPage == "friends" &&
              (
                <Friends>
                </Friends>
              )}
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      <div class="p-talk-chat">
        <div class="p-talk-chat-container">
          {props.isChoiceUser
            ? <TalkTimeLine roomid={props.roomid} />
            : <IsnotSelectUser />}
          <div class="p-talk-chat-send">
            <form class="p-talk-chat-send__form">
              <div class="p-talk-chat-send__msg">
                <div
                  class="p-talk-chat-send__dummy"
                  aria-hidden="true"
                >
                </div>
                <label>
                  <textarea
                    class="p-talk-chat-send__textarea"
                    placeholder="メッセージを入力"
                  >
                  </textarea>
                </label>
              </div>
              <div class="p-talk-chat-send__file">
                <img src="static/clip.svg" alt="file" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
