import Image from "next/image";

type ClientLogo = {
  name: string;
  src: string;
  large?: boolean;
};

const clients: ClientLogo[] = [
  { name: "Tegeta Motors", src: "/clientlogo/clean/tegeta.png" },
  { name: "Bank of Georgia", src: "/clientlogo/clean/bog.png" },
  { name: "TBC Bank", src: "/clientlogo/clean/tbc-bank.png", large: true },
  { name: "Cellfie", src: "/clientlogo/clean/cellfie.png" },
  { name: "Windfor's Agency", src: "/clientlogo/clean/windfor.png" },
  { name: "Hyundai", src: "/clientlogo/clean/hyundai.png" },
  { name: "Tbilisi Acres", src: "/clientlogo/clean/tbilisi-acres.png" }
];

export function ClientsStrip() {
  const renderRail = (keyPrefix: string) =>
    clients.map((client, index) => (
      <div className="neo-clients__chip" key={`${keyPrefix}-${client.name}-${index}`}>
        <Image
          src={client.src}
          alt={client.name}
          width={420}
          height={150}
          className={`neo-clients__logo${client.large ? " neo-clients__logo--large" : ""}`}
          sizes="(max-width: 768px) 140px, 220px"
        />
      </div>
    ));

  return (
    <section className="neo-clients">
      <div className="container">
        <p className="eyebrow">Selected Clients</p>
      </div>

      <div className="neo-clients__track" aria-label="Selected clients">
        <div className="neo-clients__marquee">
          <div className="neo-clients__rail">{renderRail("a")}</div>
          <div className="neo-clients__rail" aria-hidden="true">
            {renderRail("b")}
          </div>
        </div>
      </div>
    </section>
  );
}
