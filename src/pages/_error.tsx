
const ErrorPage = ({ statusCode }) => {

    return (
        <div className="flex w-full h-[calc(100vh-6rem)] bg-MainGreen-100 rounded-lg items-center flex-col"> 
            {statusCode && (
                <p className="text-8xl mt-40 font-extraboldbold">{statusCode}</p>
            )}
            <p className="text-6xl mb-5">{`Oops something went wrong :(`}</p>
            {statusCode ? (
                <div className="">
                    {statusCode === 404 && (
                        <p className="text-xl italic">Sorry, the page you're trying to access does not exist.</p>
                    )}
                    {statusCode === 500 && (
                        <p className="text-xl italic">We apologize, but something unexpected went wrong while trying to process your request. </p>
                    )}
                </div>
            ) : (
                <div>
                    <p>An error occurred on client</p>
                </div>
            )}
        </div>
      )
}
     
ErrorPage.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}
    
export default ErrorPage;