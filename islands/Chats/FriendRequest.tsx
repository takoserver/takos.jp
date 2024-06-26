import { useEffect, useState } from "preact/hooks"

// Define the InputProps interface for type-checking
interface InputProps {
  value: string
  setValue: (value: string) => void
  origin: string
}

// Define the RegisterForm component
export default function RegisterForm(props: { origin: string }) {
  const [showModal, setShowModal] = useState(false)
  const [value, setValue] = useState("")

  // Toggle the modal visibility
  const handleButtonClick = () => {
    setShowModal(!showModal)
  }

  // Fetch data whenever the modal is shown
  useEffect(() => {
    if (showModal) {
      const fetchData = async () => {
        const resp = await fetch("./api/v1/chats/friendkey?reload=false")
        const data = await resp.json()
        if (data.status === false) {
          console.log("error")
          return
        }
        const url = props.origin + data.addFriendKey
        setValue(url)
      }
      fetchData()
    }
  }, [showModal, props.origin])

  return (
    <>
      <li class="c-talk-rooms">
        <a onClick={handleButtonClick}>
          <div class="c-talk-rooms-icon">
            <img src="./people.png" alt="" />
          </div>
          <div class="c-talk-rooms-box">
            <div class="c-talk-rooms-name">
              <p>リクエスト</p>
            </div>
            <div class="c-talk-rooms-msg">
              <p></p>
            </div>
          </div>
        </a>
      </li>
      {showModal && (
        <div class="fixed z-50 w-full h-full overflow-hidden bg-[rgba(75,92,108,0.4)] left-0 top-0">
          <div class="bg-[#f0f0f5] lg:w-1/3 w-full h-full lg:h-4/6 mx-auto lg:my-[6.5%] p-5 lg:rounded-xl">
            <div class="flex justify-end">
              <span
                class="ml-0 text-3xl text-black font-[bold] no-underline cursor-pointer"
                onClick={handleButtonClick}
              >
                ×
              </span>
            </div>
            <div class="w-4/5 mx-auto my-0">
              <div class="text-center text-sm">
                <p class="text-black hover:underline font-medium text-3xl mt-4 mb-5">
                  保留中
                </p>
              </div>
              <div>
                <Input
                  value={value}
                  setValue={setValue}
                  origin={props.origin}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Define the Input component
function Input({ value, setValue, origin }: InputProps) {
  const handleChangeUrl = (event: any) => {
    event.preventDefault()
    const updateUrl = async () => {
      const resp = await fetch("./api/v1/chats/friendkey?reload=true")
      const data = await resp.json()
      if (data.status === false) {
        console.log("error")
        return
      }
      const url = origin + data.addFriendKey
      setValue(url)
    }
    updateUrl()
  }

  return (
    <>
      <div class="w-full text-gray-900 text-sm rounded-lg h-16">
        <VideoList />
      </div>
    </>
  )
}

// Define the User component
function User({ icon, userName }: { icon: string; userName: string }) {
  return (
    <>
      <li class="c-talk-rooms flex mb-2 bg-white border border-gray-300">
        <a>
          <div class="c-talk-rooms-icon">
            <img src={icon} />
          </div>
          <div class="c-talk-rooms-box">
            <div class="c-talk-rooms-name">
              <p>{userName}</p>
            </div>
            <div class="c-talk-rooms-msg">
              <p></p>
            </div>
          </div>
        </a>
        <div class="mt-auto mb-auto ml-auto flex">
          <div class="ml-2">
            <button class="w-1 h-1 bg-blue-400 text-lg text-white font-semibold rounded-full">
              ＋
            </button>
          </div>
          <div>
            <button class="w-1 h-1 bg-blue-400 text-lg text-white font-semibold rounded-full">
              －
            </button>
          </div>
        </div>
      </li>
      <hr />
    </>
  )
}

// Define the VideoList component
const VideoList = () => {
  const [items, setItems] = useState<{ icon: string; userName: string }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("./api/v1/friends/reqLists")
      const response = await res.json()
      setItems(response.result)
    }
    fetchData()
  }, [])

  return (
    <div className="container mx-auto mt-8">
      <div className="bg-white rounded-lg overflow-y-auto max-h-96 mx-auto">
        <ul className="space-y-2 p-4">
          {items.map((video, index) => (
            <User
              key={index}
              icon={video.icon}
              userName={video.userName}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

// Function to copy text to clipboard
async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    alert("URLをコピーしました！")
  } catch (err) {
    alert("コピーに失敗しました！")
  }
}
