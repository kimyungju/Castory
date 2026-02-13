import Link from "next/link";
import { Mic2 } from "lucide-react";

const EmptyState = ({
  title,
  buttonLink,
  buttonText,
}: {
  title: string;
  buttonLink?: string;
  buttonText?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 border-4 border-dashed border-mid-gray">
      <Mic2 size={48} className="text-white-4" />
      <p className="text-18 font-bold text-white-4">{title}</p>
      {buttonLink && (
        <Link href={buttonLink} className="btn-brutal mt-2 text-14 px-6 py-3">
          {buttonText ?? "Discover"}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
