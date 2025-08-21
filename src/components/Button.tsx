export default function Button(props: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={props.onClick}
      className={`bg-gray-200 rounded-sm w-full px-2 py-1 cursor-pointer flex justify-center items-center md:text-lg transition ${props.className}`}
    >
      {props.children}
    </button>
  );
}
