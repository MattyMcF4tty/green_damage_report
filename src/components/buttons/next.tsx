
interface NextButtonProps {
    pageName: string
}

const NextButton = ({pageName}: NextButtonProps) => {


    return (
        <button type="submit" className="text-white bg-MainGreen-300 w-full h-full">
            Next
        </button>
    )
}

export default NextButton;