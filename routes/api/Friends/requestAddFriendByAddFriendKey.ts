import { getCookies } from "https://deno.land/std@0.220.1/http/cookie.ts"
import csrftoken from "../../../models/csrftoken.ts"
import Friends from "../../../models/friends.ts"
import requestAddFriend from "../../../models/reqestAddFriend.js"
import Users from "../../../models/users.js";
export const handler = {
  async POST(req: Request,ctx: any) {
    if (!ctx.state.data.loggedIn) {
      return new Response(JSON.stringify({ "status": "Please Login" }), {
        headers: { "Content-Type": "application/json" },
        status: 401,
      })
    }
    const data = await req.json()
    const cookies = getCookies(req.headers)
    if (typeof data.csrftoken !== "string") {
      return new Response(JSON.stringify({ status: "error" }), {
        headers: { "Content-Type": "application/json" },
        status: 403,
      })
    }
    const iscsrfToken = await csrftoken.findOne({ token: data.csrftoken })
    if (iscsrfToken === null || iscsrfToken === undefined) {
      return new Response(JSON.stringify({ status: "error" }), {
        headers: { "Content-Type": "application/json" },
        status: 403,
      })
    }
    if (iscsrfToken.sessionID !== cookies.sessionid) {
      return new Response(JSON.stringify({ status: "error" }), {
        headers: { "Content-Type": "application/json" },
        status: 403,
      })
    }
    await csrftoken.deleteOne({ token: data.csrftoken })
    const userName = ctx.state.data.userName
    // request add friend
    const { addFriendKey } = data;
    const addFriendUserInfo = await Users.findOne({addFriendKey: addFriendKey})
    if(addFriendKey === null || addFriendUserInfo === null) {
      return
    }
    //すでに友達か
    const friendsInfo: any = await Friends.findOne({ user: userName })
    const friends = friendsInfo.friends
    interface FriendsType {
      userName: string;
      room: string;
      lastMessage: string;
    }
    interface SendReqType {
      userName: string;
      timestamp: Date;
    }
    const isAlredyFriend = friends.some((friend: FriendsType) => {friend.userName === addFriendUserInfo.userName })
    if(isAlredyFriend) {
      return
    }
    //すでにリクエストを送っているか
    const requestAddFriendInfo = await requestAddFriend.findOne({userName: addFriendUserInfo.userName})
    if(requestAddFriendInfo !== null) {
      await requestAddFriend.create({userName: addFriendUserInfo.userName})
    } else {
      const isAlredySendReq = requestAddFriendInfo.Applicant.some((friend: SendReqType) => {friend.userName === addFriendUserInfo.userName })
      if(isAlredySendReq) {
        return
      }
    }
    //await requestAddFriend.findOneAndUpdate({name: 'myname'}, {$set: {phone: '09011112222'}, $push: {reviews: [{rating: 2}]}, $unset: {isDeleted: true} }, {runValidator: true, new: true, projection: 'name phone reviews isDeleted'}).lean()
  },
}
