export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-xl font-semibold">
        PayRewards
      </h1>

      <div className="rounded-lg bg-gray-100 px-4 py-2">
        <span className="text-sm text-gray-500">
          Coins
        </span>

        <span className="ml-2 font-semibold">
          1,250
        </span>
      </div>
    </header>
  );
}