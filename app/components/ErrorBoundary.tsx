import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();
  
  let errorMessage: string;
  let statusCode: number | null = null;
  
  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error occurred';
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          {statusCode ? `Error ${statusCode}` : 'Error'}
        </h1>
        
        <p className="text-gray-700 mb-6">{errorMessage}</p>
        
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}