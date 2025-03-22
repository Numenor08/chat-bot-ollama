import { ExitIcon } from "@radix-ui/react-icons";
import { useModelContext } from "@/app/store/ContextProvider";
import ChooseModel from "@/app/ui/Topbar/ChooseModel";
import ToggleButton from "@/app/ui/Topbar/ToggleButton";

function Topbar() {
    const { isSideOpen, setIsSideOpen } = useModelContext();

    return (
        <div className={`${isSideOpen ? 'justify-end' : 'justify-between '} relative flex-none bg-white dark:bg-dark w-full border-b dark:border-b-0 h-[3.75rem] flex items-center px-4`}>
            <ExitIcon
                onClick={() => setIsSideOpen(!isSideOpen)} // Toggle Sidebar visibility
                className={`sidebar-button ${isSideOpen ? 'hidden' : 'block'}`}
            />
            <ChooseModel />
            <ToggleButton />
        </div>
    )
}

export default Topbar