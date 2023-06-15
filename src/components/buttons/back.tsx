import { NextRouter, useRouter } from "next/router";

interface BackButtonProps {
    pageName: string
}

const BackButton = ({pageName}: BackButtonProps) => {
    const router = useRouter()

    const handleBack = () => {
        router.push(pageName);
    }

    return (
        <button type="button" onClick={handleBack} className="text-white bg-MainGreen-300 w-full h-full">
            Previous
        </button>
    )
}

export default BackButton;