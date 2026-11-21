import { clubNextConfig } from "../../packages/config/src/next";

export default clubNextConfig({
  llmsTxt: true,
  redirects: [
    // Filtar natjecanja preselio je iz upita u putanju (popis je sad statičan).
    // Neispravan id ne odgovara uzorku, pa pada na popis kao i prije. Next
    // redirectu uvijek prilijepi izvorni upit; statičnoj stranici on ne smeta,
    // a canonical je bez njega.
    {
      source: "/raspored-i-rezultati",
      has: [
        {
          type: "query",
          key: "competitionId",
          value: "(?<competitionId>[1-9]\\d*)",
        },
      ],
      destination: "/raspored-i-rezultati/natjecanje/:competitionId",
      statusCode: 301,
    },
  ],
});
