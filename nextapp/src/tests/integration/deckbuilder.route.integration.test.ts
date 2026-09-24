import { after, afterEach, before, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { PDFDocument } from "pdf-lib";
import {
  arrangeTestData,
  installExternalBoundaryFakes,
  readTestData,
  resetTestBoundaries,
  setTestDatastoreError,
  setTestSession,
  type TestProfile,
} from "./harness";

let create: typeof import("../../app/api/deckbuilder/selections/route").POST;
let read: typeof import("../../app/api/deckbuilder/selections/[id]/route").GET;
let pdf: typeof import("../../app/api/deckbuilder/[type]/pdf/route").GET;
let allPDFs: typeof import("../../app/api/deckbuilder/all/pdf/route").GET;
let pdfBytes: Uint8Array;
let renderError: string | null = null;
let closed = false;
const navigations: string[] = [];
const cookies: Array<{ name: string; value: string; url: string }> = [];
const team = { _id: "team-a", slug: "team-a", name: "Team A" };
const otherTeam = { _id: "team-b", slug: "team-b", name: "Team B" };
const admin = {
  _id: "admin",
  email: "admin@test",
  permission: "Admin" as const,
  team: [],
};
const reader = {
  _id: "reader",
  email: "reader@test",
  permission: "User" as const,
  team: [team],
};
const outsider = {
  _id: "outsider",
  email: "outsider@test",
  permission: "User" as const,
  team: [],
};
function profile(index: number, ownTeam = team): TestProfile {
  return {
    _id: `profile-${index}`,
    _type: "profile",
    uuid: randomUUID(),
    name: `Profile ${index}`,
    slug: `profile-${index}`,
    team: [ownTeam],
  };
}
function arrange(profiles = [profile(1)]) {
  arrangeTestData({
    users: [admin, reader, outsider],
    teams: [team, otherTeam],
    profiles,
  });
  setTestSession({ user: { email: admin.email } });
  return profiles;
}
function selectionRequest(tables: unknown) {
  return new Request("http://localhost/api/deckbuilder/selections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tables }),
  });
}
function groups(profiles: TestProfile[]) {
  return [
    {
      id: "group-a",
      name: "A & B: 100%; café",
      profiles: profiles.map((item) => item.uuid),
    },
  ];
}
async function save(profiles: TestProfile[]) {
  const response = await create(selectionRequest(groups(profiles)));
  assert.equal(response.status, 201);
  return (await response.json()).id as string;
}
function readRequest(id: string) {
  return read(
    new Request(`http://localhost/api/deckbuilder/selections/${id}`),
    { params: Promise.resolve({ id }) },
  );
}
function pdfRequest(id: string, type = "workinggenius") {
  return pdf(
    new Request(
      `http://localhost/api/deckbuilder/${type}/pdf?selection=${id}&showJobRole=true&showPrimaryOnly=true`,
      {
        headers: { cookie: "test-session=fixture-session" },
      },
    ),
    { params: Promise.resolve({ type }) },
  );
}

before(async () => {
  installExternalBoundaryFakes();
  process.env.BASE_URL = "http://localhost";
  const document = await PDFDocument.create();
  document.addPage();
  pdfBytes = await document.save();
  mock.module("puppeteer-core", {
    namedExports: {
      launch: async () => ({
        close: async () => {
          closed = true;
        },
        newPage: async () => ({
          setViewport: async () => {},
          setCookie: async (...values: typeof cookies) => {
            cookies.push(...values);
          },
          goto: async (url: string) => {
            navigations.push(url);
            return { ok: () => true };
          },
          waitForSelector: async () => {},
          $eval: async () => renderError,
          evaluate: async () => {},
          emulateMediaType: async () => {},
          pdf: async () => pdfBytes,
        }),
      }),
    },
  });
  ({ POST: create } =
    await import("../../app/api/deckbuilder/selections/route"));
  ({ GET: read } =
    await import("../../app/api/deckbuilder/selections/[id]/route"));
  ({ GET: pdf } = await import("../../app/api/deckbuilder/[type]/pdf/route"));
  ({ GET: allPDFs } = await import("../../app/api/deckbuilder/all/pdf/route"));
});
after(() => mock.reset());
afterEach(() => {
  resetTestBoundaries();
  navigations.length = 0;
  cookies.length = 0;
  renderError = null;
  closed = false;
});

describe("Deckbuilder saved selections and PDF routes", () => {
  it("keeps an earlier shared selection unchanged when a new selection is saved", async () => {
    const profiles = arrange([profile(1), profile(2)]);
    const firstId = await save([profiles[0]]);
    const secondId = await save([profiles[1]]);
    assert.notEqual(firstId, secondId);
    assert.equal(readTestData().documents?.length, 2);
    for (const [id, expected] of [
      [firstId, profiles[0].uuid],
      [secondId, profiles[1].uuid],
    ]) {
      const response = await readRequest(id);
      assert.equal(response.status, 200);
      assert.deepEqual(
        (await response.json()).tables[0].profiles.map(
          (item: TestProfile) => item.uuid,
        ),
        [expected],
      );
    }
  });

  it("rechecks revoked membership when reopening or exporting an existing link", async () => {
    const id = await save(arrange());
    setTestSession({ user: { email: reader.email } });
    assert.equal((await readRequest(id)).status, 200);
    const current = readTestData();
    arrangeTestData({
      ...current,
      users: current.users.map((user) =>
        user._id === reader._id ? { ...user, team: [] } : user,
      ),
    });
    const response = await readRequest(id);
    assert.equal(response.status, 403);
    assert.match((await response.json()).error, /do not have access/);
    assert.equal((await pdfRequest(id)).status, 403);
    assert.deepEqual(readTestData().documents, current.documents);
    assert.equal(navigations.length, 0);
  });

  it("saves 1,000 profiles in a POST and restores their order, names and groups from a short ID", async () => {
    const profiles = arrange(
      Array.from({ length: 1000 }, (_, index) => profile(index)),
    );
    const tables = [
      ...groups(profiles),
      { id: "group-b", name: "Repeated profile", profiles: [profiles[0].uuid] },
    ];
    assert.ok(JSON.stringify(tables).length > 32000);
    const response = await create(selectionRequest(tables));
    assert.equal(response.status, 201);
    const { id } = await response.json();
    assert.equal(id.length, 36);
    const persisted = readTestData().documents;
    assert.equal(persisted?.length, 1);
    const restored = await readRequest(id);
    assert.equal(restored.status, 200);
    const body = await restored.json();
    assert.deepEqual(
      body.tables.map(
        (table: { id: string; name: string; profiles: TestProfile[] }) => ({
          ...table,
          profiles: table.profiles.map((item) => item.uuid),
        }),
      ),
      tables,
    );
    assert.equal(restored.headers.get("cache-control"), "private, no-store");
  });

  it("lets another authorized reader open a saved link using their current permissions", async () => {
    const profiles = arrange([profile(1), profile(2, otherTeam)]);
    const id = await save(profiles);
    setTestSession({ user: { email: reader.email } });
    const response = await readRequest(id);
    assert.equal(response.status, 200);
    assert.deepEqual(
      (await response.json()).tables[0].profiles.map(
        (item: TestProfile) => item.uuid,
      ),
      [profiles[0].uuid],
    );
    setTestSession({ user: { email: outsider.email } });
    assert.equal((await readRequest(id)).status, 403);
    setTestSession(null);
    assert.equal((await readRequest(id)).status, 401);
  });

  it("rejects unauthorized saves without creating any selection", async () => {
    const profiles = arrange([profile(1, otherTeam)]);
    setTestSession({ user: { email: reader.email } });
    assert.equal(
      (await create(selectionRequest(groups(profiles)))).status,
      403,
    );
    assert.equal(readTestData().documents?.length ?? 0, 0);
    setTestSession(null);
    assert.equal(
      (await create(selectionRequest(groups(profiles)))).status,
      401,
    );
    assert.equal(readTestData().documents?.length ?? 0, 0);
  });

  it("returns useful validation, missing-selection and datastore error responses", async () => {
    arrange();
    for (const tables of [
      null,
      [],
      [{ id: "a", name: "A", profiles: [null] }],
      [{ id: "a", name: "A", profiles: [] }],
    ]) {
      assert.equal((await create(selectionRequest(tables))).status, 400);
    }
    assert.equal(
      (
        await create(
          new Request("http://localhost/api/deckbuilder/selections", {
            method: "POST",
            body: "{",
          }),
        )
      ).status,
      400,
    );
    assert.equal((await readRequest("bad-id")).status, 400);
    assert.equal((await readRequest(randomUUID())).status, 404);
    assert.equal(readTestData().documents?.length ?? 0, 0);
    setTestDatastoreError(new Error("Fixture datastore unavailable"));
    const response = await readRequest(randomUUID());
    assert.equal(response.status, 500);
    assert.equal(typeof (await response.json()).error, "string");
  });

  it("exports a large saved selection using only a short URL and an app-scoped session", async () => {
    const profiles = arrange(
      Array.from({ length: 1000 }, (_, index) => profile(index)),
    );
    const id = await save(profiles);
    const response = await pdfRequest(id);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "application/pdf");
    assert.equal(
      (await PDFDocument.load(await response.arrayBuffer())).getPageCount(),
      1,
    );
    assert.ok(navigations[0].length < 250);
    const url = new URL(navigations[0]);
    assert.equal(url.searchParams.get("selection"), id);
    assert.equal(url.searchParams.has("groupedProfiles"), false);
    assert.equal(url.searchParams.get("showJobRole"), "true");
    assert.equal(url.searchParams.get("showPrimaryOnly"), "true");
    assert.deepEqual(
      cookies.map(({ name, value, url }) => ({ name, value, url })),
      [
        {
          name: "test-session",
          value: "fixture-session",
          url: "http://localhost",
        },
      ],
    );
    assert.equal(closed, true);
  });

  it("exports all seven comparison types and merges their PDFs", async () => {
    const id = await save(arrange());
    const response = await allPDFs(
      new Request(`http://localhost/api/deckbuilder/all/pdf?selection=${id}`),
    );
    assert.equal(response.status, 200);
    assert.equal(
      (await PDFDocument.load(await response.arrayBuffer())).getPageCount(),
      7,
    );
    assert.equal(
      new Set(navigations.map((url) => new URL(url).pathname)).size,
      7,
    );
    assert.ok(
      navigations.every(
        (url) =>
          new URL(url).searchParams.get("selection") === id && url.length < 250,
      ),
    );
    assert.equal(closed, true);
  });

  it("upgrades legacy PDF requests before Chromium navigation", async () => {
    const profiles = arrange();
    const params = new URLSearchParams({
      groupedProfiles: `Legacy:group:${profiles[0].uuid}`,
    });
    const response = await pdf(
      new Request(`http://localhost/api/deckbuilder/values/pdf?${params}`),
      { params: Promise.resolve({ type: "values" }) },
    );
    assert.equal(response.status, 200);
    assert.equal(readTestData().documents?.length, 1);
    assert.equal(
      new URL(navigations[0]).searchParams.has("groupedProfiles"),
      false,
    );
  });

  it("denies PDF requests without access and rejects invalid selections or types", async () => {
    const id = await save(arrange());
    assert.equal((await pdfRequest(id, "invalid")).status, 400);
    assert.equal((await pdfRequest(randomUUID())).status, 404);
    setTestSession({ user: { email: outsider.email } });
    assert.equal((await pdfRequest(id)).status, 403);
    assert.equal(
      (
        await allPDFs(
          new Request(
            `http://localhost/api/deckbuilder/all/pdf?selection=${id}`,
          ),
        )
      ).status,
      403,
    );
    setTestSession(null);
    assert.equal((await pdfRequest(id)).status, 401);
    assert.equal(navigations.length, 0);
  });

  it("returns a failure instead of downloading an error page and closes Chromium", async () => {
    const id = await save(arrange());
    renderError = "Fixture PDF rendering failure";
    const response = await pdfRequest(id);
    assert.equal(response.status, 500);
    assert.equal(typeof (await response.json()).error, "string");
    assert.equal(closed, true);
  });
});
