const SendMessage = ({message}) => {
    const msg = message
    return (
        <div className="justify-end">
            <div className="text-right">
                <div className="text-white p-5 text-base rounded-l-lg rounded-b-lg inline-block max-w-xl bg-blue-500">
                    {msg}
                </div>
            </div>
        </div>
    )
}

export default SendMessage
