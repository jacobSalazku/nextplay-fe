const Skeleton = () => {
  return (
    <>
      <div className="w-full animate-pulse space-y-6 rounded-xl bg-gray-950 px-2 py-4 sm:hidden">
        <div className="mb-6 h-8 w-1/2 rounded bg-gray-700" />
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-9 w-20 rounded-full bg-gray-800" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-24 rounded-xl bg-green-900" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-24 rounded-xl bg-red-900" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-24 rounded-xl bg-gray-800" />
          ))}
        </div>
        <div className="mt-6 rounded-xl bg-gray-900 p-4">
          <div className="mb-4 h-6 w-1/3 rounded bg-gray-700" />
          <div className="grid grid-cols-8 gap-3">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-6 rounded bg-gray-800" />
            ))}
          </div>
          <div className="mt-2 grid grid-cols-8 gap-3">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-6 rounded bg-gray-600" />
            ))}
          </div>
        </div>
        <div className="h-12 w-full rounded-xl bg-orange-200/50" />
      </div>
      <div className="mx-auto hidden w-full animate-pulse p-4 sm:block sm:p-6">
        <h2 className="mb-6 h-10 w-64 rounded bg-gray-700 sm:h-12 sm:w-80"></h2>

        <div className="rounded-2xl bg-gray-900 p-2 shadow-lg backdrop-blur-lg sm:p-4">
          <div className="overflow-x-auto rounded-xl border border-gray-950 shadow-sm">
            <div className="min-w-[700px] text-sm">
              <div className="bg-gray-950 text-xs text-gray-200 uppercase sm:text-sm">
                <div className="grid grid-cols-11 gap-2 p-2 sm:p-4">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i} className="h-4 rounded bg-gray-700"></div>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-gray-800">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-11 items-center gap-2 p-2 sm:p-4"
                  >
                    {Array.from({ length: 11 }).map((_, j) => (
                      <div key={j} className="h-4 rounded bg-gray-700"></div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="bg-gray-950 text-gray-300">
                <div className="grid grid-cols-11 gap-2 p-2 sm:p-4">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i} className="h-4 rounded bg-gray-800"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 w-full rounded-xl bg-gray-700"></div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <div className="h-12 w-full rounded-xl bg-gray-700 sm:w-40"></div>
        </div>
      </div>
    </>
  );
};

export default Skeleton;
