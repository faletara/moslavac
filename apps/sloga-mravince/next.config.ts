import { clubNextConfig } from "../../packages/config/src/next";

export default clubNextConfig({
  llmsTxt: true,
  redirects: [
    // Paginacija novosti je u putanji, a prva stranica je `/novosti`.
    // Next prenosi upit u odredište, pa `?page=1` nije uključen: inače bi
    // `/novosti?page=1` kružio između dva pravila. Popis ionako ne čita upit.
    {
      source: "/novosti",
      has: [{ type: "query", key: "page", value: "(?<page>[2-9]|[1-9]\\d+)" }],
      destination: "/novosti/stranica/:page",
      statusCode: 301,
    },
    { source: "/novosti/stranica/1", destination: "/novosti", statusCode: 301 },
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
