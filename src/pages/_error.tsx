import React from 'react';
import { NextPageContext } from 'next';

interface ErrorProps {
  statusCode: number;
  errorMessage?: string;
}

const ErrorPage = ({ statusCode, errorMessage }: ErrorProps) => {
  return (
    <div>
      <h1>Error</h1>
      {errorMessage || (statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client')}
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
