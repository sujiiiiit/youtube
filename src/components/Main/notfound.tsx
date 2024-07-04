const App = () => {
  return (
    <>
      <div className="not-found-text w-full h-full flex flex-col justify-center items-center gap-4">
        <img
          className="w-full max-w-28	 xs:max-w-24"
          src="/assets/monkey.png"
          alt="Not Found"
        />
        <div className="text-3xl xs:text-xl text-Primary font-bold">
          Not Found
        </div>
      </div>
    </>
  );
};

export default App;
