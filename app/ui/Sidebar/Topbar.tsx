import { ExitIcon } from "@radix-ui/react-icons";
import { useModelContext } from "@/app/store/ContextProvider";
import ChooseModel from "@/app/ui/ChooseModel";

function Topbar() {
    const { isSideOpen, setIsSideOpen } = useModelContext();

    return (
        <div className="relative flex-none bg-white w-full border-b-2 h-[3.75rem] flex items-center justify-start px-4">
            <ExitIcon
                onClick={() => setIsSideOpen(!isSideOpen)} // Toggle Sidebar visibility
                className={`w-6 h-6 cursor-pointer text-gray-500 hover:text-black transition-colors duration-300 ${isSideOpen ? 'hidden' : 'block'}`}
            />
            <ChooseModel />
        </div>
    )
}

export default Topbar