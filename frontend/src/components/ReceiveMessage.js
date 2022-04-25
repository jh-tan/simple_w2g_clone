const ReceiveMessage = ({message}) => {
    const msg = message
    return (
        <div className="justify-start">
            <div className="text-left">
                <span className="text-gray-900 p-5 rounded-r-lg rounded-b-lg inline-flex max-w-xl bg-indigo-300">
                    {msg}
                </span>
            </div>
        </div>
    )
}

export default ReceiveMessage
