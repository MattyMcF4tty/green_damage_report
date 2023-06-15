
interface BackButtonProps {
    pageName: string
}

const BackButton = ({pageName}: BackButtonProps) => {


    return (
        <button type="submit" className="text-white bg-MainGreen-300 w-full h-full">
            Previous
        </button>
    )
}

export default BackButton;