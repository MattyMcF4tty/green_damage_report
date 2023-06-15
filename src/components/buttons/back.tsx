
interface BackButtonProps {
    pageName: string
}

const BackButton = ({pageName}: BackButtonProps) => {


    return (
        <button type="submit" className="text-white bg-MainGreen-300 w-1/2 h-10">
            Previous
        </button>
    )
}

export default BackButton;