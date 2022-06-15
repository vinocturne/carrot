import { cls } from "@libs/client/utils";
import Image from "next/image";

interface MessageProps {
    message: string;
    reversed?: boolean;
    avatarUrl?: string;
}

export default function Message({
    message,
    avatarUrl,
    reversed,
}: MessageProps) {
    return (
        <div
            className={cls(
                "flex  items-start space-x-2",
                reversed ? "flex-row-reverse space-x-reverse" : ""
            )}
        >
            <div className="w-8 h-8 relative rounded-full overflow-hidden bg-slate-400">
                <Image
                    alt="avatarUrl"
                    layout="fill"
                    src={`https://imagedelivery.net/IfkIh2vCOXio26cf7UQYpw/${avatarUrl}/public`}
                />
            </div>
            <div className="w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md">
                <p>{message}</p>
            </div>
        </div>
    );
}
