const RoomNumberInput = ({setCode}) => {
    const handleCodeChange = (e) => {
        e.preventDefault();
        setCode(e.target.value)
    }

    return (
        <div className="text-center pt-12">
            <h1 className="mb-4 text-3xl">Room Code</h1>
            <input type="text" className="py-3 min-w-max border-2 rounded-xl max-w-xs text-4xl text-center" onChange={handleCodeChange} />
        </div>
    )
}

export default RoomNumberInput
