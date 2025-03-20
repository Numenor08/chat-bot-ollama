import { RotatingLines } from 'react-loader-spinner'

function ChatSuspense() {
    return (
        <div className='flex bg-white items-center justify-center h-full w-full'>
            <RotatingLines strokeColor="grey" strokeWidth='2' visible={true} width='48' />
        </div>
    )
}

export default ChatSuspense