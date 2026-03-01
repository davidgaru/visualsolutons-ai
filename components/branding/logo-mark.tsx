import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

type LogoMarkProps = {
  compact?: boolean;
  className?: string;
};

export function LogoMark({ compact = false, className }: LogoMarkProps) {
  return (
    <Link href="/" className={clsx("logo-mark", compact && "logo-mark--compact", className)}>
      <span className="logo-mark__image" aria-hidden>
        <Image
          src="/images/visualsolutions_logo_primary_clean.png"
          alt=""
          width={2560}
          height={436}
          sizes={compact ? "(max-width: 768px) 190px, 240px" : "(max-width: 768px) 230px, 320px"}
        />
      </span>
      <span className="sr-only">Visual Solutions AI</span>
    </Link>
  );
}
