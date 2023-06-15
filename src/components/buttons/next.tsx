
interface NextButtonProps {
    pageName: string
}

const NextButton = ({pageName}: NextButtonProps) => {


    return (
        <button type="submit" className="text-white bg-MainGreen-300 w-full h-10">
            Next
        </button>
    )
}

export default NextButton;