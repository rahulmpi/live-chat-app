interface Props{
    onSubmit: (e:any) => void,
    onLocation: () => void,
    input: string,
    setInput: (e:string) => void
}
const BottomBar = ({onSubmit, onLocation, input, setInput}:Props) => {
  return (
    <div className="compose">
    <form id="message-form" onSubmit={onSubmit}>
        <input name="message" placeholder="Message" required autoComplete="off" value={input} onChange={(e) => setInput(e.target.value)}/>
        <button type="submit">Send</button>
    </form>
    <button id="send-location" onClick={onLocation}>Send location</button>
</div>
  )
}

export default BottomBar