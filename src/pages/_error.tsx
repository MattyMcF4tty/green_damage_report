import React from 'react';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';

interface ErrorProps {
  statusCode: number;
  errorMessage?: string;
}

const ErrorPage = ({ statusCode, errorMessage }: ErrorProps) => {
  const Router = useRouter();

  if (statusCode === 404) {
    return (
      <div className='w-full h-[100vh] flex justify-center items-center flex-col'>
        <h1 className='text-8xl text-MainGreen-300 mb-2'>{statusCode}</h1>
        <span className='text-xl mb-20'>The page you trying to access does not exist</span>
        <button
        onClick={() => Router.push("/")}
        className="border-[1px] border-MainGreen-300 p-2 rounded-md hover:text-white hover:bg-MainGreen-300 duration-150"
        >
          Return to homepage
        </button>      
      </div>
    )
  } else if (statusCode === 500) {
    return (
      <div className='w-full h-[100vh] flex justify-center items-center flex-col'>
        <h1 className='text-8xl text-MainGreen-300 mb-2'>500</h1>
        <span className='text-xl mb-20'>Internal server error</span>
        <button
        onClick={() => Router.push("/")}
        className="border-[1px] border-MainGreen-300 p-2 rounded-md hover:text-white hover:bg-MainGreen-300 duration-150"
        >
          Return to homepage
        </button>      
      </div>
    )
  } else {
    return (
      <div>
        <h1>Error</h1>
        {errorMessage || (statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client')}
      </div>
    );
  }
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
