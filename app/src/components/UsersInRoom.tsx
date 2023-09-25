import { useOthers, useSelf } from "../liveblocks.config";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function UsersInRoom() {
  const self = useSelf((state) => state.info);
  const others = useOthers().map(({ info, id }) => ({ ...info, id }));
  return (
    <div className="flex mr-4">
      {self && <UserInRoom {...self} />}
      {others.map((user) => (
        <UserInRoom key={user.id} {...user} />
      ))}
    </div>
  );
}

export function UserInRoom(info: { name: string; picture: string }) {
  return (
    <Tooltip>
      <TooltipTrigger className="-ml-2">
        <img
          src={info.picture}
          alt={info.name}
          className="w-8 h-8 rounded-full border-2 border-white"
        />
      </TooltipTrigger>
      <TooltipContent>
        <span>{info.name}</span>
      </TooltipContent>
    </Tooltip>
  );
}
