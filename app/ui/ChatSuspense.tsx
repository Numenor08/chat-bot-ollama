import { RotatingTriangles } from 'react-loader-spinner'

function ChatSuspense() {
    return (
        <div className='flex items-center justify-center h-full w-full'>
            <RotatingTriangles colors={['#8f8f8f', '#525252', '#1E1E1E']} visible={true} width='48' height='36'/>
        </div>
    )
}

export default ChatSuspense