import clsx from "clsx";
import Image from "next/image";

type ExactLogoProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function ExactLogo({ className, priority = false, sizes = "100vw" }: ExactLogoProps) {
  return (
    <div className={clsx("exact-logo", className)}>
      <Image
        src="/images/visualsolutions_logo_primary_clean.png"
        alt="Visual Solutions AI"
        width={2560}
        height={436}
        priority={priority}
        sizes={sizes}
      />
    </div>
  );
}
