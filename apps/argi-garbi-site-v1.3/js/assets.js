/* Single source for every Figma asset used by the site.
   These are temporary Figma MCP URLs (they expire after ~7 days).
   Run `node tools/localize-assets.mjs` on a machine with internet access to download
   them into /assets and rewrite this file to local paths. */
window.ASSETS = {
  logo:             "https://www.figma.com/api/mcp/asset/fa3d861b-1ca6-40e7-b94e-ba9eca8547cf.svg",
  cardHome:         "img/card-argi-ds.png",
  cardButton:       "img/button-card.png",
  completing:       "https://www.figma.com/api/mcp/asset/a0960ea8-875b-4a28-aeb3-77bb63523b2a.svg",
  completed:        "https://www.figma.com/api/mcp/asset/665105c7-72f1-44c2-a4ab-b5153b8de034.svg",
  more:             "https://www.figma.com/api/mcp/asset/9350bec6-39b6-46a4-bfb8-80f84566756d.svg",
  chevronDown:      "https://www.figma.com/api/mcp/asset/00b9cc82-09e0-4f4a-991e-08657e7c82fc.svg",
  chevronUp:        "https://www.figma.com/api/mcp/asset/be6aec51-4045-425f-ae21-08ce5dc11c7e.svg",
  calChevronRight:  "https://www.figma.com/api/mcp/asset/81742be4-4748-43d7-964d-9093d6419166.svg",
  calChevronLeft:   "https://www.figma.com/api/mcp/asset/cba7ac30-7075-4f01-a155-2a4cca60d72c.svg",
  calChevronDown:   "https://www.figma.com/api/mcp/asset/7ee0a9cf-f307-4e6b-a1b4-f3732864b465.svg",
  pickerChevronUp:  "https://www.figma.com/api/mcp/asset/2964bc43-ae1e-492d-8998-5779d50ce1ec.svg",
  close:            "https://www.figma.com/api/mcp/asset/75def2e2-6719-4c9f-85fc-8bf1c2eac56f.svg",
  cancel:           "https://www.figma.com/api/mcp/asset/ee395141-8c99-4384-ac0d-e8f769b369f5.svg",
  anatomy:          "https://www.figma.com/api/mcp/asset/5bb1709d-cfa7-4034-88c8-8b1a5d7bbfb8.png"
};
