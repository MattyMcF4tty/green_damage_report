
interface EmailPopUpProps {
    setId: (id: string) => void;
    reportIDs: string[];
}

const EmailPopUp = ({setId, reportIDs}: EmailPopUpProps) => {

    return (
        <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-auto">
            <div className="bg-white h-20 w-20">
            </div>            
        </div>
    )
}

export default EmailPopUp;