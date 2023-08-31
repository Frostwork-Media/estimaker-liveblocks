import classNames from "classnames";

export function WorldSvg(
  props: React.SVGProps<SVGSVGElement> & {
    isPublic: boolean;
  }
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      stroke="currentColor"
      strokeWidth={0}
      className="w-6 h-6"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        cx={12}
        cy={12}
        r={10}
        stroke="red"
        className={classNames(
          {
            "fill-green-300": props.isPublic,
            "fill-[transparent]": !props.isPublic,
          },
          "transition-colors duration-1000"
        )}
      />
      <path
        stroke="none"
        className={classNames(
          {
            "fill-blue-600": props.isPublic,
            "fill-[currentColor]": !props.isPublic,
          },
          "transition-colors duration-1000"
        )}
        d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM4 12c0-.899.156-1.762.431-2.569L6 11l2 2v2l2 2 1 1v1.931C7.061 19.436 4 16.072 4 12zm14.33 4.873C17.677 16.347 16.687 16 16 16v-1a2 2 0 0 0-2-2h-4v-3a2 2 0 0 0 2-2V7h1a2 2 0 0 0 2-2v-.411C17.928 5.778 20 8.65 20 12a7.947 7.947 0 0 1-1.67 4.873z"
      />
    </svg>
  );
}