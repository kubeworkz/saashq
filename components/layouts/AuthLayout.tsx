type Props = {
  children: React.ReactNode;
  heading?: string;
  description?: string;
};

export default function AuthLayout({ children, heading, description }: Props) {
  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <img
            src="https://lh3.googleusercontent.com/drive-viewer/AFGJ81q51XldYgrMPHo5LvzN2eAHUFal73JIbcUvtherBtk9EVDp9xUnydYVd8guT2BQuwfUdDDVsFY68fXvKMWAYSCb6ZLd=s1600"
            className="mx-auto h-12 w-auto"
            alt="SaasHQ"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {heading}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
